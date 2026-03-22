import { StoreRepository } from '#kernel/store/domain/repository/store_repository'
import { Store } from '#kernel/store/domain/entity/store'
import { AppId } from '#shared/domain/app_id'
import { default as StoreActiveRecord } from '#database/active-records/store'

import { default as BusinessHoursActiveRecord } from '#database/active-records/store_business_hours'
import { BusinessHours } from '#shared/domain/value-objects/business_hours'
import { Address } from '#shared/domain/value-objects/address'
import { PhoneNumber } from '#shared/domain/value-objects/phone_number'
import db from '@adonisjs/lucid/services/db'

export class StoreARRepository implements StoreRepository {
  async findById(id: AppId): Promise<Store | null> {
    const store = await StoreActiveRecord.findBy({ id: id.value })

    const businessHours = await BusinessHoursActiveRecord.query().where({ storeId: id.value })
    if (store) {
      return new Store(
        AppId.fromString(store.id),
        store.designation,
        Address.of(store.address),
        PhoneNumber.of(store.phoneContact1),
        businessHours.map((bh) => BusinessHours.from(bh.day, bh.open, bh.close)),
        store.whatsAppContact ? PhoneNumber.of(store.whatsAppContact) : null,
        store.phoneContact2 ? PhoneNumber.of(store.phoneContact2) : null,
        { status: store.status, reason: store.statusReason || undefined },
        store.createdAt.toJSDate(),
        store.updatedAt.toJSDate()
      )
    }

    return null
  }

  async save(entity: Store): Promise<void> {
    const phone2 = entity.getPhoneContact2()
    const whatsapp = entity.getWhatsAppContact()

    const object = {
      designation: entity.getDesignation(),
      address: Address.toJson(entity.getAddress()),
      phoneContact1: PhoneNumber.toJson(entity.getPhoneContact1()),
      whatsAppContact: whatsapp ? PhoneNumber.toJson(whatsapp) : null,
      phoneContact2: phone2 ? PhoneNumber.toJson(phone2) : null,
      status: entity.getStatus().status,
      statusReason: entity.getStatus().reason || undefined,
    }

    const trx = await db.transaction()

    try {
      let storeRecord: StoreActiveRecord

      if (entity.getId()) {
        storeRecord = await StoreActiveRecord.updateOrCreate(
          { id: entity.getId()!.value },
          object,
          { client: trx }
        )
      } else {
        storeRecord = await StoreActiveRecord.create(object, { client: trx })
        entity.setId(AppId.fromString(storeRecord.id))
      }

      const businessHours = entity.getBusinessHours()
      await BusinessHoursActiveRecord.query({ client: trx })
        .where('store_id', entity.getId()!.value)
        .delete()

      for (const businessHour of businessHours) {
        await BusinessHoursActiveRecord.create(
          {
            storeId: entity.getId()!.value,
            ...BusinessHours.toJson(businessHour),
          },
          { client: trx }
        )
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
