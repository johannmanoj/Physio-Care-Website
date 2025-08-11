import React, { useState } from 'react';

function DemographicData({ data, onDataChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onDataChange({ [name]: value });
  };

  return (
    <>
      <div className="subjective-details-field-row">
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="Name">Name</label>
          <input
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Name"
          />
        </div>
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="age">Age</label>
          <input
            name="age"
            value={data.age}
            onChange={handleChange}
            placeholder="Age"
          />
        </div>
      </div>

      <div className="subjective-details-field-row">
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="sex">Sex</label>
          <input
            name="sex"
            value={data.sex}
            onChange={handleChange}
            placeholder="Sex"
          />
        </div>
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="occupation">Occupation</label>
          <input
            name="occupation"
            value={data.occupation}
            onChange={handleChange}
            placeholder="Occupation"
          />
        </div>
      </div>

      <div className="subjective-details-field-row">
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="contact">Contact Number</label>
          <input
            name="contact_num"
            value={data.contact_num}
            onChange={handleChange}
            placeholder="Contact Number"
          />
        </div>
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="medicine-allergies">Medicine Allergies</label>
          <input
            name="medical_allergies"
            value={data.medical_allergies}
            onChange={handleChange}
            placeholder="Medical Allergies"
          />
        </div>
      </div>

      <div className="subjective-details-field-row">
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="address">Address</label>
          <input
            name="address"
            value={data.address}
            onChange={handleChange}
            placeholder="Address"
          />
        </div>
        <div className="subjective-details-field subjective-details-field-2">
          <label htmlFor="chief_complaints">Other Ailments</label>
          <input
            name="other_ailments"
            value={data.other_ailments}
            onChange={handleChange}
            placeholder="Other Ailments"
          />
        </div>
      </div>
      
    </>
  );
}

export default DemographicData;