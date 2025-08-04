import React, { useState } from 'react';
import './SubjectiveDetails.css'


function SubjectiveDetails() {
  return (
    <>
      <div className="subjective-details-field-row">
        <div className="subjective-details-field subjective-details-field-1">
          <label htmlFor="Desciption">Desciption</label>
          <textarea></textarea>
        </div>
      </div>
    </>
  );
}

export default SubjectiveDetails;
