import React, { useState } from 'react';
import './PatientDetails.css'

// import the three tab‑panel components
import SubjectiveDetails from './SubjectiveDetails';
import ObjectiveDetails from './ObjectiveDetails';
import OnExamination from './OnExamination'
import DifferentialDiagnosis from './DifferentialDiagnosis';
import TreatmentGoal from './TreatmentGoal';
import DemographicData from './DemographicData';
import Physio from './Physio';

function PatientDetails() {
  // const TABS = ['Demographic Data', 'Physio', 'Subjective', 'Objective', 'On Examination', 'Differential Diagnosis', 'Treatment Goals'];
  const TABS = ['Demographic Data', 'Physio', 'Differential Diagnosis', 'Treatment Goals'];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="patient-details-page">
      <div className='patient-details-page-card'>
        {/* ── header ─────────────────────────────────────── */}
        <header className="patient-header">
          <h1>Patient Info</h1>

          <nav className="tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab ${activeTab === tab ? 'tab--active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        {/* ── tab panels ─────────────────────────────────── */}
        {activeTab === 'Demographic Data' && <DemographicData />}
        {activeTab === 'Physio' && <Physio />}
        {activeTab === 'Subjective' && <SubjectiveDetails />}
        {activeTab === 'Objective' && <ObjectiveDetails />}
        {activeTab === 'On Examination' && <OnExamination />}
        {activeTab === 'Differential Diagnosis' && <DifferentialDiagnosis />}
        {activeTab === 'Treatment Goals' && <TreatmentGoal />}

        {/* ── save ───────────────────────────────────────── */}
        <div className="patient-details-save">

          <button>Cancel</button>
          <button>Save</button>
        </div>
      </div>
    </div>
  );
}

export default PatientDetails;
