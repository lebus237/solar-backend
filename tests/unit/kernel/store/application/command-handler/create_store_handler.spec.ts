import { test } from '@japa/runner'
import { CreateStoreHandler } from '#kernel/store/application/command_handler/create_store_handler'
import { CreateStoreCommand } from '#kernel/store/application/command/create_store_command'
import { StoreRepository } from '#kernel/store/domain/repository/store_repository'
import { Store } from '#kernel/store/domain/entity/store'
import { Address } from '#shared/domain/value-objects/address'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'
import { BusinessHours } from '#shared/domain/value-objects/business_hours'
import { DomainError } from '#shared/domain/errors/domain_error'

test.group('CreateStoreHandler', () => {
  const makeAddress = () =>
    Address.of({
      street: '123 Solar Way',
      city: 'Douala',
      country: 'Cameroon',
      postalCode: '00000',
      region: 'Littoral',
    })

  const makePhone = (e164: string) => PhoneNumber.fromE164(e164)

  const makeBusinessHours = () => [
    BusinessHours.from('Monday', 8, 17),
    BusinessHours.from('Tuesday', 8, 17),
    BusinessHours.from('Wednesday', 8, 17),
  ]

  const createMockRepository = (): StoreRepository => ({
    save: async () => {},
    findById: async () => null as any,
  })

  test('should create and save store with valid command data', async ({ assert }) => {
    let savedStore: Store | null = null

    const mockRepository: StoreRepository = {
      ...createMockRepository(),
      save: async (store: Store) => {
        savedStore = store
      },
    }

    const command = new CreateStoreCommand(
      'Main Branch',
      makeAddress(),
      makePhone('+237699112233'),
      makeBusinessHours(),
      makePhone('+237677445566'),
      makePhone('+237655001122')
    )

    const handler = new CreateStoreHandler(mockRepository)
    await handler.handle(command)

    assert.isDefined(savedStore)
    assert.equal(savedStore!.getDesignation(), 'Main Branch')
    assert.equal(savedStore!.getAddress().city, 'Douala')
    assert.equal(savedStore!.getPhoneContact1().toE164(), '+237699112233')
    assert.equal(savedStore!.getWhatsAppContact()!.toE164(), '+237677445566')
    assert.equal(savedStore!.getPhoneContact2()!.toE164(), '+237655001122')
    assert.lengthOf(savedStore!.getBusinessHours(), 3)
  })

  test('should call repository.save once with Store entity', async ({ assert }) => {
    let saveCalled = 0
    let capturedStore: Store | null = null

    const mockRepository: StoreRepository = {
      ...createMockRepository(),
      save: async (store: Store) => {
        saveCalled += 1
        capturedStore = store
      },
    }

    const command = new CreateStoreCommand(
      'Downtown Store',
      makeAddress(),
      makePhone('+237611223344'),
      makeBusinessHours()
    )

    const handler = new CreateStoreHandler(mockRepository)
    await handler.handle(command)

    assert.equal(saveCalled, 1)
    assert.isDefined(capturedStore)
    assert.instanceOf(capturedStore!, Store)
  })

  test('should set optional contacts to null when not provided', async ({ assert }) => {
    let savedStore: Store | null = null

    const mockRepository: StoreRepository = {
      ...createMockRepository(),
      save: async (store: Store) => {
        savedStore = store
      },
    }

    const command = new CreateStoreCommand(
      'Community Store',
      makeAddress(),
      makePhone('+237622334455'),
      makeBusinessHours()
    )

    const handler = new CreateStoreHandler(mockRepository)
    await handler.handle(command)

    assert.isDefined(savedStore)
    assert.isNull(savedStore!.getWhatsAppContact())
    assert.isNull(savedStore!.getPhoneContact2())
  })

  test('should propagate domain error for conflicting business hours', async ({ assert }) => {
    const conflictingBusinessHours = [
      BusinessHours.from('Monday', 8, 12),
      BusinessHours.from('Monday', 13, 17),
    ]

    const command = new CreateStoreCommand(
      'Invalid Store',
      makeAddress(),
      makePhone('+237633445566'),
      conflictingBusinessHours
    )

    const handler = new CreateStoreHandler(createMockRepository())

    try {
      await handler.handle(command)
      assert.fail('Should have thrown a domain error')
    } catch (error) {
      assert.instanceOf(error, DomainError)
      assert.equal((error as DomainError).code, 'STORE_CONFLICTING_BUSINESS_HOURS')
    }
  })
})
