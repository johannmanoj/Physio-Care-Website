import React, { useState } from 'react';

function DemographicData() {
  return (
    <>
      <div className="subjective-details-field-row">
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="Name">Name</label>
          <input type="text" />
        </div>
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="age">Age</label>
          <input type="text" />
        </div>
      </div>

      <div className="subjective-details-field-row">
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="sex">Sex</label>
          <input type="text" />
        </div>
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="occupation">Occupation</label>
          <input type="text" />
        </div>
      </div>

      <div className="subjective-details-field-row">
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="contact">Contact Number</label>
          <input type="text" />
        </div>
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="medicine-allergies">Medicine Allergies</label>
          <input type="text" />
        </div>
      </div>

      <div className="subjective-details-field-row">
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="address">Address</label>
          <input type="text" />
        </div>
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="chief_complaints">Other Ailments</label>
          <input type="text" />
        </div>
      </div>
      
    </>
  );
}

export default DemographicData;