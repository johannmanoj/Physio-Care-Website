import React, { useState } from 'react';
import './ObjectiveDetails.css'
import PainAssessmentSketch from './PainAssessmentSketch';

function ObjectiveDetails({ data, onDataChange }) {
  const TABS = ['On Examination', 'Pain Assessment'];
  const [activeSelection, setActiveSelection] = useState(TABS[0])

  return (
    <div className="patient-details-page">
      <div className='patient-details-page-card'>
        <header className="patient-header">
          <nav className="tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSelection(tab)}
                className={`tab ${activeSelection === tab ? 'tab--active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        {activeSelection === 'On Examination' && (
          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-1">
              <label htmlFor="Desciption">Desciption</label>
              <textarea
                name="onexamination_desc"
                value={data.onexamination_desc}
                onChange={(e) =>
                  onDataChange({ onexamination_desc: e.target.value })
                }
                placeholder="Enter on-examination description"
              />
            </div>
          </div>
        )}

        {activeSelection === 'Pain Assessment' && (
          <>
            <PainAssessmentSketch className="pain-assessment-image-group-sketch" data={data} onDataChange={onDataChange}/>
          </>
        )}
      </div>
    </div>
  );
}

export default ObjectiveDetails;
