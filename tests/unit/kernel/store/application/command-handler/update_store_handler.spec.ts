import { test } from '@japa/runner'
import { UpdateStoreHandler } from '#kernel/store/application/command_handler/update_store_handler'
import { UpdateStoreCommand } from '#kernel/store/application/command/update_store_command'
import { StoreRepository } from '#kernel/store/domain/repository/store_repository'
import { Store } from '#kernel/store/domain/entity/store'
import { AppId } from '#shared/domain/app_id'
import { Address } from '#shared/domain/value-objects/address'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'
import { BusinessHours } from '#shared/domain/value-objects/business_hours'
import { NotFoundApplicationError } from '#shared/application/errors/not_found_application_error'
import { StoreStatusEnum } from '#kernel/store/domain/types/store_status'

test.group('UpdateStoreHandler', () => {
  const STORE_ID = '00000000-0000-4000-8000-0000000000a1'
  const STORE_ID_2 = '00000000-0000-4000-8000-0000000000a2'

  const createAddress = (street = '123 Solar St', city = 'Douala') =>
    Address.of({
      street,
      city,
      country: 'Cameroon',
      postalCode: '00000',
      region: 'Littoral',
    })

  const createPhone = (number: string) =>
    PhoneNumber.of({
      countryCode: '237',
      number,
    })

  const createBusinessHours = () => [
    BusinessHours.from('Monday', 8, 17),
    BusinessHours.from('Tuesday', 8, 17),
  ]

  const createExistingStore = (): Store =>
    new Store(
      AppId.fromString(STORE_ID),
      'Original Store',
      createAddress('Old Street', 'Yaounde'),
      createPhone('612345678'),
      createBusinessHours(),
      createPhone('699999999'),
      createPhone('677777777'),
      { status: StoreStatusEnum.ACTIVE, reason: 'Operational' },
      new Date('2024-01-01'),
      new Date('2024-01-10')
    )

  const createBaseRepository = (store: Store | null = createExistingStore()): StoreRepository => ({
    save: async () => {},
    findById: async () => store as any,
  })

  test('should fetch store by id from repository', async ({ assert }) => {
    let capturedId: AppId | null = null

    const repository: StoreRepository = {
      ...createBaseRepository(),
      findById: async (id: AppId) => {
        capturedId = id
        return createExistingStore() as any
      },
    }

    const handler = new UpdateStoreHandler(repository)
    const command = new UpdateStoreCommand(
      AppId.fromString(STORE_ID),
      'Updated Store',
      createAddress('New Street', 'Douala'),
      createPhone('655555555'),
      createBusinessHours()
    )

    await handler.handle(command)

    assert.equal(capturedId!.value, STORE_ID)
  })

  test('should throw NotFoundApplicationError when store does not exist', async ({ assert }) => {
    const repository: StoreRepository = createBaseRepository(null)
    const handler = new UpdateStoreHandler(repository)

    const command = new UpdateStoreCommand(
      AppId.fromString(STORE_ID_2),
      'Unknown Store',
      createAddress(),
      createPhone('611111111'),
      createBusinessHours()
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

  test('should save updated store with command values', async ({ assert }) => {
    let savedStore: Store | null = null

    const repository: StoreRepository = {
      ...createBaseRepository(),
      save: async (store: Store) => {
        savedStore = store
      },
    }

    const handler = new UpdateStoreHandler(repository)
    const command = new UpdateStoreCommand(
      AppId.fromString(STORE_ID),
      'Updated Main Store',
      createAddress('45 New Ave', 'Buea'),
      createPhone('633333333'),
      [BusinessHours.from('Wednesday', 9, 18)],
      createPhone('644444444'),
      createPhone('666666666')
    )

    await handler.handle(command)

    assert.isDefined(savedStore)
    assert.equal(savedStore!.getId().value, STORE_ID)
    assert.equal(savedStore!.getDesignation(), 'Updated Main Store')
    assert.equal(savedStore!.getAddress().city, 'Buea')
    assert.equal(savedStore!.getPhoneContact1().toE164(), '+237633333333')
    assert.equal(savedStore!.getWhatsAppContact()!.toE164(), '+237644444444')
    assert.equal(savedStore!.getPhoneContact2()!.toE164(), '+237666666666')
    assert.lengthOf(savedStore!.getBusinessHours(), 1)
    assert.equal(savedStore!.getBusinessHours()[0].day.toName(), 'Wednesday')
  })

  test('should preserve existing businessHours when command.businessHours is undefined', async ({
    assert,
  }) => {
    let savedStore: Store | null = null
    const existing = createExistingStore()

    const repository: StoreRepository = {
      ...createBaseRepository(existing),
      save: async (store: Store) => {
        savedStore = store
      },
    }

    const handler = new UpdateStoreHandler(repository)
    const command = new UpdateStoreCommand(
      AppId.fromString(STORE_ID),
      'Updated Store',
      createAddress('Another Street', 'Douala'),
      createPhone('622222222'),
      undefined
    )

    await handler.handle(command)

    assert.deepEqual(savedStore!.getBusinessHours(), existing.getBusinessHours())
  })

  test('should preserve existing whatsapp and phoneContact2 when command optional contacts are undefined', async ({
    assert,
  }) => {
    let savedStore: Store | null = null
    const existing = createExistingStore()

    const repository: StoreRepository = {
      ...createBaseRepository(existing),
      save: async (store: Store) => {
        savedStore = store
      },
    }

    const handler = new UpdateStoreHandler(repository)
    const command = new UpdateStoreCommand(
      AppId.fromString(STORE_ID),
      'Updated Store',
      createAddress('Updated Street', 'Limbe'),
      createPhone('600000000')
    )

    await handler.handle(command)

    assert.equal(
      savedStore!.getWhatsAppContact()!.toE164(),
      existing.getWhatsAppContact()!.toE164()
    )
    assert.equal(savedStore!.getPhoneContact2()!.toE164(), existing.getPhoneContact2()!.toE164())
  })

  test('should preserve existing status and createdAt metadata', async ({ assert }) => {
    let savedStore: Store | null = null
    const existing = createExistingStore()

    const repository: StoreRepository = {
      ...createBaseRepository(existing),
      save: async (store: Store) => {
        savedStore = store
      },
    }

    const handler = new UpdateStoreHandler(repository)
    const command = new UpdateStoreCommand(
      AppId.fromString(STORE_ID),
      'Metadata Check Store',
      createAddress('Meta Street', 'Kribi'),
      createPhone('611222333'),
      createBusinessHours()
    )

    await handler.handle(command)

    assert.equal(savedStore!.getStatus().status, existing.getStatus().status)
    assert.equal(savedStore!.getStatus().reason, existing.getStatus().reason)
    assert.deepEqual(savedStore!.getCreatedAt(), existing.getCreatedAt())
  })
})
