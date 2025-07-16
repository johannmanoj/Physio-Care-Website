import React, { useState } from 'react';
import './OnExamination.css'


function MedicalInfoTab() {
  const TABS = ['Vital Signs', 'Motor Assessment', 'Sensory Assessment'];
  const [activeSelection, setActiveSelection] = useState(TABS[0])

  const motor_assessment_data = [
    {
      joint: "Cervical",
    },
    {
      joint: "Shoulder",
    },
    {
      joint: "Elbow",
    },
    {
      joint: "Forearm",
    },
    {
      joint: "Hand & Fingers",
    },

  ];

  return (
    <div className='onexamination-card'>
      <nav className="sub-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSelection(tab)}
            className={`sub-tab ${activeSelection === tab ? 'sub-tab--active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </nav>
      {activeSelection === "Motor Assessment" && (
        <div>
          <div className="onexamination-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Joint</th>
                  <th>Movement</th>
                  <th>Active RT/LT</th>
                  <th>Passive RL/LT</th>
                  <th>Endfeel</th>
                  <th>Limitation</th>
                </tr>
              </thead>
              <tbody id="itemsBody" className="onexamination-table-body">
                {motor_assessment_data.map((assessment_data) => (
                  <tr>
                    <td>{assessment_data.joint}</td>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                    <td><input type="text" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="onset">Muscle Strength (MMT)</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-2">
            </div>
          </div>
          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="onset">Muscle Power</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-2">
            </div>
          </div>
          <h2>Reflexes</h2>

          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="onset">Biceps</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="onset">Triceps</label>
              <input type="text" />
            </div>
          </div>
          <br />
          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="onset">Limb Length Discrepancies (UL)</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-2">
            </div>
          </div>
        </div>
      )}

      {activeSelection === 'Sensory Assessment' && (
        <div>
          <h2>Dermatomes</h2>
          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-3">
              <label htmlFor="onset">Superficial</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-3">
              <label htmlFor="onset">Deep</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-3">
              <label htmlFor="onset">Combined</label>
              <input type="text" />
            </div>
          </div>
          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="onset">Myotomes</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-2">
            </div>
          </div>
          <br />
          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="onset">Outcome Measures</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-2">
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MedicalInfoTab;
