import { test } from '@japa/runner'
import { Store } from '#kernel/store/domain/entity/store'
import { StoreStatusEnum } from '#kernel/store/domain/types/store_status'
import { Address } from '#shared/domain/value-objects/address'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'
import { BusinessHours } from '#shared/domain/value-objects/business_hours'
import { AppId } from '#shared/domain/app_id'
import { DomainError } from '#shared/domain/errors/domain_error'

test.group('Store Entity', () => {
  const STORE_ID = '00000000-0000-4000-8000-000000000001'

  const makeAddress = () =>
    Address.of({
      street: '123 Solar Street',
      city: 'Douala',
      country: 'Cameroon',
      postalCode: '00000',
      region: 'Littoral',
    })

  const makePhone1 = () =>
    PhoneNumber.of({
      countryCode: '237',
      number: '670000001',
    })

  const makePhone2 = () =>
    PhoneNumber.of({
      countryCode: '237',
      number: '670000002',
    })

  const makeWhatsApp = () =>
    PhoneNumber.of({
      countryCode: '237',
      number: '670000003',
    })

  const makeBusinessHours = () => [
    BusinessHours.from('Monday', 8, 17),
    BusinessHours.from('Tuesday', 8, 17),
    BusinessHours.from('Wednesday', 8, 17),
  ]

  const makeStore = () =>
    new Store(
      AppId.fromString(STORE_ID),
      'Bonamoussadi Branch',
      makeAddress(),
      makePhone1(),
      makeBusinessHours(),
      makeWhatsApp(),
      makePhone2(),
      { status: StoreStatusEnum.INACTIVE },
      new Date('2024-01-01'),
      new Date('2024-01-10')
    )

  test('should create store with all properties', ({ assert }) => {
    const store = makeStore()

    assert.equal(store.getId().value, STORE_ID)
    assert.equal(store.getDesignation(), 'Bonamoussadi Branch')
    assert.equal(store.getAddress().toInline(), makeAddress().toInline())
    assert.equal(store.getPhoneContact1().toE164(), makePhone1().toE164())
    assert.equal(store.getWhatsAppContact()!.toE164(), makeWhatsApp().toE164())
    assert.equal(store.getPhoneContact2()!.toE164(), makePhone2().toE164())
    assert.equal(store.getStatus().status, StoreStatusEnum.INACTIVE)
    assert.deepEqual(store.getCreatedAt(), new Date('2024-01-01'))
    assert.deepEqual(store.getUpdatedAt(), new Date('2024-01-10'))
  })

  test('should create store with default optional values', ({ assert }) => {
    const store = new Store(
      null,
      'Akwa Branch',
      makeAddress(),
      makePhone1(),
      makeBusinessHours(),
      null
    )

    assert.isNull(store.getId())
    assert.isNull(store.getWhatsAppContact())
    assert.isNull(store.getPhoneContact2())
    assert.equal(store.getStatus().status, StoreStatusEnum.INACTIVE)
    assert.isUndefined(store.getCreatedAt())
    assert.isUndefined(store.getUpdatedAt())
  })

  test('should expose business hours list', ({ assert }) => {
    const store = makeStore()
    const hours = store.getBusinessHours()

    assert.lengthOf(hours, 3)
    assert.equal(hours[0].day.toName(), 'Monday')
    assert.equal(hours[1].day.toName(), 'Tuesday')
    assert.equal(hours[2].day.toName(), 'Wednesday')
  })

  test('should change status to ACTIVE without reason', ({ assert }) => {
    const store = makeStore()

    store.changeStatus(StoreStatusEnum.ACTIVE)

    assert.equal(store.getStatus().status, StoreStatusEnum.ACTIVE)
    assert.isUndefined(store.getStatus().reason)
  })

  test('should change status to INACTIVE with reason', ({ assert }) => {
    const store = makeStore()

    store.changeStatus(StoreStatusEnum.INACTIVE, 'Temporarily closed for maintenance')

    assert.equal(store.getStatus().status, StoreStatusEnum.INACTIVE)
    assert.equal(store.getStatus().reason, 'Temporarily closed for maintenance')
  })

  test('should throw DomainError when business hours contain duplicate day entries', ({
    assert,
  }) => {
    const duplicatedHours = [
      BusinessHours.from('Monday', 8, 12),
      BusinessHours.from('Monday', 13, 17),
    ]

    try {
      new Store(null, 'Duplicate Hours Branch', makeAddress(), makePhone1(), duplicatedHours, null)
      assert.fail('Expected DomainError to be thrown')
    } catch (error) {
      assert.instanceOf(error, DomainError)
      assert.equal((error as DomainError).code, 'STORE_CONFLICTING_BUSINESS_HOURS')
      assert.include((error as Error).message, 'Conflicting business hours')
    }
  })

  test('should allow unique business days only', ({ assert }) => {
    const uniqueHours = [
      BusinessHours.from('Monday', 8, 17),
      BusinessHours.from('Tuesday', 8, 17),
      BusinessHours.from('Friday', 9, 16),
    ]

    const store = new Store(
      null,
      'Unique Hours Branch',
      makeAddress(),
      makePhone1(),
      uniqueHours,
      null
    )

    assert.lengthOf(store.getBusinessHours(), 3)
    assert.equal(store.getBusinessHours()[0].day.toName(), 'Monday')
    assert.equal(store.getBusinessHours()[1].day.toName(), 'Tuesday')
    assert.equal(store.getBusinessHours()[2].day.toName(), 'Friday')
  })
})
