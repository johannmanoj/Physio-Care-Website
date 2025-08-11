import React, { useState } from 'react';
import './SubjectiveDetails.css'


function SubjectiveDetails({ data, onDataChange }) {
  return (
    <>
      <div className="subjective-details-field-row">
        <div className="subjective-details-field subjective-details-field-1">
          <label htmlFor="Desciption">Desciption</label>
          <textarea
            name="subjective_desc"
            value={data.subjective_desc}
            onChange={(e) =>
              onDataChange({ subjective_desc: e.target.value })
            }
            placeholder="Enter subjective description"
          />
        </div>
      </div>
    </>
  );
}

export default SubjectiveDetails;
