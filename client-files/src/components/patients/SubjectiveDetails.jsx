import React, { useState } from 'react';
import './SubjectiveDetails.css'
import body_image from '../../assets/body-sketch.png'
import PainAssessmentSketch from './PainAssessmentSketch';
// import MedicalImageAnnotator from './MedicalImageAnnotator';


function SubjectiveDetails() {
  return (
    <>

      <div className="subjective-details-field-row">
        <div className="subjective-details-field subjective-details-field-1">
          <label htmlFor="Desciption">Desciption</label>
          <textarea></textarea>
          {/* <input type="text" /> */}
        </div>

      </div>


    </>
  );
}

export default SubjectiveDetails;
