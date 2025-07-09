import React from 'react';

function ContactInfoTab() {
  return (
    <>
    <div>
        <button>On Observation</button>
        <button>On Palpation</button>
      </div>
      <div className="patient-field-row">
        <div className="patient-field">
          <label htmlFor="mobile-number">Mobile Number</label>
          <input type="text" />
        </div>
        <div className="patient-field">
          <label htmlFor="alternate-contact">Alternate Contact</label>
          <input type="text" />
        </div>
      </div>

      <div className="patient-field-row">
        <div className="patient-field">
          <label htmlFor="email">Email</label>
          <input type="email" />
        </div>
        <div className="patient-field">
          <label htmlFor="address">Address</label>
          <input type="text" />
        </div>
      </div>

      <div className="patient-field-row">
        <div className="patient-field">
          <label htmlFor="city">City</label>
          <input type="text" />
        </div>
        <div className="patient-field">
          <label htmlFor="state">State</label>
          <input type="text" />
        </div>
        <div className="patient-field">
          <label htmlFor="pincode">Pincode</label>
          <input type="text" />
        </div>
      </div>
    </>
  );
}

export default ContactInfoTab;
