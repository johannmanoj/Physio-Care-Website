import React, { useState } from 'react';

// import the three tab‑panel components
import SubjectiveDetails from './SubjectiveDetails';
import ObjectiveDetails from './ObjectiveDetails';
import OnExamination from './OnExamination'

function PatientDetails() {
  const TABS = ['Subjective', 'Objective', 'On Examination', 'Differential Diagnosis', 'Treatment Goals'];
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="patient-page">
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
      {activeTab === 'Subjective'   && <SubjectiveDetails />}
      {activeTab === 'Objective' && <ObjectiveDetails />}
      {activeTab === 'On Examination' && <OnExamination />}

      {/* ── save ───────────────────────────────────────── */}
      <div className="patient-save">
        <button>Save</button>
      </div>
    </div>
  );
}

export default PatientDetails;
