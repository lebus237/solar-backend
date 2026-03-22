import { test } from '@japa/runner'
import { ChangeStoreStatusHandler } from '#kernel/store/application/command_handler/change_store_status_hanler'
import { ChangeStoreStatusCommand } from '#kernel/store/application/command/change_store_status'
import { StoreRepository } from '#kernel/store/domain/repository/store_repository'
import { Store } from '#kernel/store/domain/entity/store'
import { StoreStatusEnum } from '#kernel/store/domain/types/store_status'
import { NotFoundApplicationError } from '#shared/application/errors/not_found_application_error'
import { AppId } from '#shared/domain/app_id'
import { Address } from '#shared/domain/value-objects/address'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'
import { BusinessHours } from '#shared/domain/value-objects/business_hours'

test.group('ChangeStoreStatusHandler', () => {
  const STORE_1 = '00000000-0000-4000-8000-0000000000s1'.replace('s', 'b')
  const NON_EXISTENT = '00000000-0000-4000-8000-00000000ffff'

  const createExistingStore = (): Store => {
    return new Store(
      AppId.fromString(STORE_1),
      'Main Store',
      Address.of({
        street: '123 Solar Street',
        city: 'Douala',
        country: 'Cameroon',
        postalCode: '0000',
        region: 'Littoral',
      }),
      PhoneNumber.fromE164('+237699123456'),
      [BusinessHours.from('Monday', 8, 17), BusinessHours.from('Tuesday', 8, 17)],
      PhoneNumber.fromE164('+237677123456'),
      PhoneNumber.fromE164('+237655123456')
    )
  }

  const createMockRepository = (store: Store | null = createExistingStore()): StoreRepository => ({
    save: async () => {},
    findById: async () => store as any,
  })

  test('should change store status to active with reason', async ({ assert }) => {
    let savedStore: Store | null = null

    const mockRepository: StoreRepository = {
      ...createMockRepository(),
      save: async (store: Store) => {
        savedStore = store
      },
    }

    const handler = new ChangeStoreStatusHandler(mockRepository)
    const command = new ChangeStoreStatusCommand(
      AppId.fromString(STORE_1),
      StoreStatusEnum.ACTIVE,
      'Store is now operational'
    )

    await handler.handle(command)

    assert.isDefined(savedStore)
    assert.equal(savedStore!.getStatus().status, StoreStatusEnum.ACTIVE)
    assert.equal(savedStore!.getStatus().reason, 'Store is now operational')
  })

  test('should change store status to inactive without reason', async ({ assert }) => {
    let savedStore: Store | null = null

    const mockRepository: StoreRepository = {
      ...createMockRepository(),
      save: async (store: Store) => {
        savedStore = store
      },
    }

    const handler = new ChangeStoreStatusHandler(mockRepository)
    const command = new ChangeStoreStatusCommand(
      AppId.fromString(STORE_1),
      StoreStatusEnum.INACTIVE
    )

    await handler.handle(command)

    assert.isDefined(savedStore)
    assert.equal(savedStore!.getStatus().status, StoreStatusEnum.INACTIVE)
    assert.isUndefined(savedStore!.getStatus().reason)
  })

  test('should call repository.findById with correct store id', async ({ assert }) => {
    let capturedId: AppId | null = null

    const mockRepository: StoreRepository = {
      ...createMockRepository(),
      findById: async (id: AppId) => {
        capturedId = id
        return createExistingStore() as any
      },
    }

    const handler = new ChangeStoreStatusHandler(mockRepository)
    const command = new ChangeStoreStatusCommand(
      AppId.fromString(STORE_1),
      StoreStatusEnum.ACTIVE,
      'Re-opening'
    )

    await handler.handle(command)

    assert.equal(capturedId!.value, STORE_1)
  })

  test('should save the same store entity after status change', async ({ assert }) => {
    const existingStore = createExistingStore()
    let savedStore: Store | null = null

    const mockRepository: StoreRepository = {
      ...createMockRepository(existingStore),
      save: async (store: Store) => {
        savedStore = store
      },
    }

    const handler = new ChangeStoreStatusHandler(mockRepository)
    const command = new ChangeStoreStatusCommand(
      AppId.fromString(STORE_1),
      StoreStatusEnum.ACTIVE,
      'Approved'
    )

    await handler.handle(command)

    assert.strictEqual(savedStore, existingStore)
    assert.equal(savedStore!.getStatus().status, StoreStatusEnum.ACTIVE)
    assert.equal(savedStore!.getStatus().reason, 'Approved')
  })

  test('should throw NotFoundApplicationError when store does not exist', async ({ assert }) => {
    const mockRepository: StoreRepository = {
      ...createMockRepository(null),
      findById: async () => null as any,
    }

    const handler = new ChangeStoreStatusHandler(mockRepository)
    const command = new ChangeStoreStatusCommand(
      AppId.fromString(NON_EXISTENT),
      StoreStatusEnum.ACTIVE,
      'Activation attempt'
    )

    try {
      await handler.handle(command)
      assert.fail('Should have thrown an error')
    } catch (error) {
      assert.instanceOf(error, NotFoundApplicationError)
      assert.equal(
        (error as NotFoundApplicationError).message,
        `Store with id ${command.storeId} not found`
      )
    }
  })
})
