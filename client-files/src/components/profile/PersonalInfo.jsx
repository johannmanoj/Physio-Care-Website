import React from 'react'

const PersonalInfo = ({ profileData, updateProfileData, handleSave }) => {
    return (
        <div>
            <div className='user-page-sub-heading'>Personal Information</div>

            <div className='data-field-row'>
                <div className='data-field data-field-2'>
                    <label>Employee ID</label>
                    <input
                        name="id"
                        value={profileData.id ?? ''}
                        onChange={(e) => updateProfileData({ id: e.target.value })}
                        readOnly
                    />
                </div>
                <div className='data-field data-field-2'>
                    <label>Name</label>
                    <input
                        name="name"
                        value={profileData.name ?? ''}
                        onChange={(e) => updateProfileData({ name: e.target.value })}
                        placeholder="Name"
                    />
                </div>
            </div>

            <div className='data-field-row'>
                <div className='data-field data-field-2'>
                    <label>Email</label>
                    <input
                        name="email"
                        value={profileData.email ?? ''}
                        onChange={(e) => updateProfileData({ email: e.target.value })}
                        placeholder="Email"
                    />
                </div>
                <div className='data-field data-field-2'>
                    <label>Phone</label>
                    <input
                        type="number"
                        name="phone"
                        value={profileData.phone ?? ''}
                        onChange={(e) => updateProfileData({ phone: e.target.value })}
                        placeholder="Phone"
                    />
                </div>
            </div>

            {/* <h1> Bank Details</h1> */}
            <div className='user-page-sub-heading'>Bank Details</div>
            <div className='data-field-row'>
                <div className='data-field data-field-4'>
                    <label>Bank Name</label>
                    <input
                        name="bank_name"
                        value={profileData.bank_name ?? ''}
                        onChange={(e) => updateProfileData({ bank_name: e.target.value })}
                        placeholder="Bank Name"
                    />
                </div>
                <div className='data-field data-field-4'>
                    <label>Account Holder Name</label>
                    <input
                        name="acc_holder_name"
                        value={profileData.acc_holder_name ?? ''}
                        onChange={(e) => updateProfileData({ acc_holder_name: e.target.value })}
                        placeholder="Account Holder Name"
                    />
                </div>
                <div className='data-field data-field-4'>
                    <label>Account Number</label>
                    <input
                        type="number"
                        name="acc_number"
                        value={profileData.acc_number ?? ''}
                        onChange={(e) => updateProfileData({ acc_number: e.target.value })}
                        placeholder="Account Number"
                    />
                </div>
                <div className='data-field data-field-4'>
                    <label>IFSC Code</label>
                    <input
                        name="ifsc_code"
                        value={profileData.ifsc_code ?? ''}
                        onChange={(e) => updateProfileData({ ifsc_code: e.target.value })}
                        placeholder="IFSC Code"
                    />
                </div>
            </div>

            <div className='profile-save'>
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    )
}

export default PersonalInfo