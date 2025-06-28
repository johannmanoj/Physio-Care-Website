import React, { useState } from 'react';
import './PatientPage.css';   // make sure the new CSS (below) is here

function PatientPage() {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showMedicalInfo, setShowMedicalInfo] = useState(false);

  return (
    <div className="patient-page">
      <h1>Patient Info</h1>

      {/* ─── Basic Info ──────────────────────────────────── */}
      <div className="patient-field-row">
        <div className="patient-field">
          <label htmlFor="patient_id">Patient ID</label>
          <input type="text" />
        </div>
        <div className="patient-field">
          <label htmlFor="role">Role</label>
          <input type="text" />
        </div>
      </div>

      <div className="patient-field-row">
        <div className="patient-field">
          <label htmlFor="first-name">First Name</label>
          <input type="text" />
        </div>
        <div className="patient-field">
          <label htmlFor="last-name">Last Name</label>
          <input type="text" />
        </div>
      </div>

      <div className="patient-field-row">
        <div className="patient-field">
          <label htmlFor="gender">Gender</label>
          <input type="text" />
        </div>
        <div className="patient-field">
          <label htmlFor="marital-status">Marital Status</label>
          <input type="text" />
        </div>
      </div>

      <div className="patient-field-row">
        <div className="patient-field">
          <label htmlFor="dob">Date of Birth</label>
          <input type="date" />
        </div>
        <div className="patient-field">
          <label htmlFor="age">Age</label>
          <input type="text" />
        </div>
      </div>

      {/* ─── Contact Information Accordion ───────────────── */}
      <div className="accordion">
        <button
          className="accordion__btn"
          onClick={() => setShowContactInfo(!showContactInfo)}
        >
          <span>Contact Information</span>
          {/* arrow icon – changes automatically */}
          <span className="accordion__arrow">
            {showContactInfo ? '▲' : '▼'}
          </span>
        </button>

        {showContactInfo && (
          <div className="accordion__body">
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
          </div>
        )}
      </div>

      {/* ─── Medical Information Accordion ──────────────── */}
      <div className="accordion">
        <button
          className="accordion__btn"
          onClick={() => setShowMedicalInfo(!showMedicalInfo)}
        >
          <span>Medical Information</span>
          <span className="accordion__arrow">
            {showMedicalInfo ? '▲' : '▼'}
          </span>
        </button>

        {showMedicalInfo && (
          <div className="accordion__body">
            <div className="patient-field-row">
              <div className="patient-field">
                <label htmlFor="chief-complaint">Chief Complaint</label>
                <input type="text" />
              </div>
              <div className="patient-field">
                <label htmlFor="medical-history">Medical History</label>
                <input type="text" />
              </div>
            </div>

            <div className="patient-field-row">
              <div className="patient-field">
                <label htmlFor="allergies">Allergies</label>
                <input type="text" />
              </div>
              <div className="patient-field">
                <label htmlFor="injury-history">Injury History</label>
                <input type="text" />
              </div>
            </div>

            <div className="patient-field-row">
              <div className="patient-field">
                <label htmlFor="ongoing-medications">Ongoing Medications</label>
                <input type="text" />
              </div>
              <div className="patient-field">
                <label htmlFor="referring-doctor">Referring Doctor</label>
                <input type="text" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Save ───────────────────────────────────────── */}
      <div className="patient-save">
        <button>Save</button>
      </div>
    </div>
  );
}

export default PatientPage;
