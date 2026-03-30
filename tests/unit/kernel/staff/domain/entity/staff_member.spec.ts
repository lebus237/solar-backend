import { test } from '@japa/runner'
import { StaffMember } from '#kernel/staff/domain/entity/staff_member'
import { AppId } from '#shared/domain/app_id'

const STAFF_ID = '00000000-0000-4000-8000-000000000001'
const USER_ID = '00000000-0000-4000-8000-000000000002'
const IMG_ID = '00000000-0000-4000-8000-000000000003'

const makeStaffMember = () =>
  // overrides: Partial<ConstructorParameters<typeof StaffMember>[0]> = {}
  {
    return new StaffMember(
      AppId.fromString(STAFF_ID),
      AppId.fromString(USER_ID),
      'John Doe',
      'john.doe@example.com',
      '+2348012345678',
      { name: 'Jane Doe', phone: '+2348098765432' },
      'Solar Engineer',
      'Engineering',
      'full_time',
      'staff',
      'active',
      AppId.fromString(IMG_ID),
      'https://example.com/profile.jpg',
      new Date('2024-01-01'),
      new Date('2024-01-15')
    )
  }

test.group('StaffMember Entity', () => {
  // ============================================
  // Constructor & Getters
  // ============================================

  test('should create staff member with all required properties', ({ assert }) => {
    const staffMember = makeStaffMember()

    assert.equal(staffMember.getId()!.value, STAFF_ID)
    assert.equal(staffMember.getUserId()!.value, USER_ID)
    assert.equal(staffMember.getFullName(), 'John Doe')
    assert.equal(staffMember.getEmail(), 'john.doe@example.com')
    assert.equal(staffMember.getPhone(), '+2348012345678')
    assert.equal(staffMember.getJobTitle(), 'Solar Engineer')
    assert.equal(staffMember.getDepartment(), 'Engineering')
    assert.equal(staffMember.getEmploymentType(), 'full_time')
    assert.equal(staffMember.getRole(), 'staff')
    assert.equal(staffMember.getStatus(), 'active')
    assert.equal(staffMember.getProfileImageId()!.value, IMG_ID)
    assert.equal(staffMember.getProfileImageUrl(), 'https://example.com/profile.jpg')
  })

  test('should return emergency contact when set', ({ assert }) => {
    const staffMember = makeStaffMember()
    const contact = staffMember.getEmergencyContact()

    assert.isNotNull(contact)
    assert.equal(contact!.name, 'Jane Doe')
    assert.equal(contact!.phone, '+2348098765432')
  })

  test('should return null for optional fields when not provided', ({ assert }) => {
    const staffMember = new StaffMember(
      null,
      null,
      'Jane Smith',
      'jane.smith@example.com',
      null,
      null,
      'Technician',
      null,
      'contract',
      'staff',
      'active',
      null,
      null
    )

    assert.isNull(staffMember.getId())
    assert.isNull(staffMember.getUserId())
    assert.isNull(staffMember.getPhone())
    assert.isNull(staffMember.getEmergencyContact())
    assert.isNull(staffMember.getDepartment())
    assert.isNull(staffMember.getProfileImageId())
    assert.isNull(staffMember.getProfileImageUrl())
  })

  test('should return createdAt and updatedAt when provided', ({ assert }) => {
    const staffMember = makeStaffMember()

    assert.deepEqual(staffMember.getCreatedAt(), new Date('2024-01-01'))
    assert.deepEqual(staffMember.getUpdatedAt(), new Date('2024-01-15'))
  })

  test('should return undefined for createdAt and updatedAt when not provided', ({ assert }) => {
    const staffMember = new StaffMember(
      null,
      null,
      'Jane Smith',
      'jane.smith@example.com',
      null,
      null,
      'Technician',
      null,
      'contract',
      'staff',
      'active',
      null,
      null
    )

    assert.isUndefined(staffMember.getCreatedAt())
    assert.isUndefined(staffMember.getUpdatedAt())
  })

  // ============================================
  // Setters
  // ============================================

  test('should update fullName via setFullName', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setFullName('Jane Smith')
    assert.equal(staffMember.getFullName(), 'Jane Smith')
  })

  test('should update email via setEmail', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setEmail('jane.smith@example.com')
    assert.equal(staffMember.getEmail(), 'jane.smith@example.com')
  })

  test('should update phone via setPhone', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setPhone('+2348011111111')
    assert.equal(staffMember.getPhone(), '+2348011111111')
  })

  test('should set phone to null via setPhone', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setPhone(null)
    assert.isNull(staffMember.getPhone())
  })

  test('should update emergencyContact via setEmergencyContact', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setEmergencyContact({ name: 'Bob', phone: '+2348099999999' })
    const contact = staffMember.getEmergencyContact()
    assert.equal(contact!.name, 'Bob')
    assert.equal(contact!.phone, '+2348099999999')
  })

  test('should set emergencyContact to null via setEmergencyContact', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setEmergencyContact(null)
    assert.isNull(staffMember.getEmergencyContact())
  })

  test('should update jobTitle via setJobTitle', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setJobTitle('Senior Engineer')
    assert.equal(staffMember.getJobTitle(), 'Senior Engineer')
  })

  test('should update department via setDepartment', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setDepartment('Operations')
    assert.equal(staffMember.getDepartment(), 'Operations')
  })

  test('should set department to null via setDepartment', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setDepartment(null)
    assert.isNull(staffMember.getDepartment())
  })

  test('should update employmentType via setEmploymentType', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setEmploymentType('part_time')
    assert.equal(staffMember.getEmploymentType(), 'part_time')
  })

  test('should update role via setRole', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setRole('manager')
    assert.equal(staffMember.getRole(), 'manager')
  })

  test('should update status via setStatus', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setStatus('inactive')
    assert.equal(staffMember.getStatus(), 'inactive')
  })

  test('should update profileImageId via setProfileImageId', ({ assert }) => {
    const staffMember = makeStaffMember()
    const newImgId = AppId.fromString('00000000-0000-4000-8000-000000000099')
    staffMember.setProfileImageId(newImgId)
    assert.equal(staffMember.getProfileImageId()!.value, '00000000-0000-4000-8000-000000000099')
  })

  test('should set profileImageId to null via setProfileImageId', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setProfileImageId(null)
    assert.isNull(staffMember.getProfileImageId())
  })

  test('should update profileImageUrl via setProfileImageUrl', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setProfileImageUrl('https://example.com/new-profile.jpg')
    assert.equal(staffMember.getProfileImageUrl(), 'https://example.com/new-profile.jpg')
  })

  test('should set profileImageUrl to null via setProfileImageUrl', ({ assert }) => {
    const staffMember = makeStaffMember()
    staffMember.setProfileImageUrl(null)
    assert.isNull(staffMember.getProfileImageUrl())
  })

  test('should set id via setId', ({ assert }) => {
    const staffMember = new StaffMember(
      null,
      null,
      'Jane Smith',
      'jane.smith@example.com',
      null,
      null,
      'Technician',
      null,
      'contract',
      'staff',
      'active',
      null,
      null
    )

    assert.isNull(staffMember.getId())
    const newId = AppId.fromString(STAFF_ID)
    staffMember.setId(newId)
    assert.equal(staffMember.getId()!.value, STAFF_ID)
  })

  // ============================================
  // Role & Status Variants
  // ============================================

  test('should support all valid role types', ({ assert }) => {
    const roles: Array<'admin' | 'manager' | 'staff'> = ['admin', 'manager', 'staff']

    for (const role of roles) {
      const staffMember = makeStaffMember()
      staffMember.setRole(role)
      assert.equal(staffMember.getRole(), role)
    }
  })

  test('should support all valid employment types', ({ assert }) => {
    const types: Array<'full_time' | 'part_time' | 'contract'> = [
      'full_time',
      'part_time',
      'contract',
    ]

    for (const type of types) {
      const staffMember = makeStaffMember()
      staffMember.setEmploymentType(type)
      assert.equal(staffMember.getEmploymentType(), type)
    }
  })

  test('should support both valid status types', ({ assert }) => {
    const staffMember = makeStaffMember()

    staffMember.setStatus('active')
    assert.equal(staffMember.getStatus(), 'active')

    staffMember.setStatus('inactive')
    assert.equal(staffMember.getStatus(), 'inactive')
  })
})
