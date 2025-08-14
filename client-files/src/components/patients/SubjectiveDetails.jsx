import React, { useState } from 'react';


function SubjectiveDetails({ data, onDataChange }) {
  return (
    <>
      <div className="data-field-row">
        <div className="data-field data-field-1">
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
