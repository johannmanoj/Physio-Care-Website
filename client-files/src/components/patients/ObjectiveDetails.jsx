import React, { useState } from 'react';
import PainAssessmentSketch from './PainAssessmentSketch';

function ObjectiveDetails({ data, onDataChange }) {
  const TABS = ['On Examination', 'Pain Assessment'];
  const [activeSelection, setActiveSelection] = useState(TABS[0])

  return (
    <div>
      <div className='patient-details-page-card'>
        <header className="patient-header">
          <nav className="main-heading-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSelection(tab)}
                className={`main-heading-tab ${activeSelection === tab ? 'main-heading-tab--active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        {activeSelection === 'On Examination' && (
          <div className="data-field-row">
            <div className="data-field data-field-1">
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
          <PainAssessmentSketch className="pain-assessment-image-group-sketch" data={data} onDataChange={onDataChange}/>
        )}

      </div>
    </div>
  );
}

export default ObjectiveDetails;
