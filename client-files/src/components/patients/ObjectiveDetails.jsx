import React, { useState } from 'react';
import './ObjectiveDetails.css'
import head_image from '../../assets/head-sketch.png'
import OnExamination from './OnExamination'
import PainAssessmentSketch from './PainAssessmentSketch';



function ContactInfoTab() {
  const TABS = ['On Examination', 'Pain Assessment'];
  const [activeSelection, setActiveSelection] = useState(TABS[0])

  return (
    <div className="patient-details-page">
      <div className='patient-details-page-card'>
        {/* ── header ─────────────────────────────────────── */}
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
              <textarea></textarea>
              {/* <input type="text" /> */}
            </div>

          </div>
        )}

        {activeSelection === 'Pain Assessment' && (
          <>
            <PainAssessmentSketch className="pain-assessment-image-group-sketch"/>
            



          </>
        )}
       


      </div>
    </div>
  );
}

export default ContactInfoTab;
