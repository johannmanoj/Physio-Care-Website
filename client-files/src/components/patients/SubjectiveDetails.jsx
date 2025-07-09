import React, { useState } from 'react';


function BasicInfoTab() {
    const TABS = ['Demographic Data', 'History', 'Pain Assessment'];
    const [activeSelection , setActiveSelection] = useState(TABS[0])



  return (
    <>
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

        {activeSelection === 'Demographic Data' && (
        <>
            {/* ── Contact Info ────────────────────────────── */}
            <div className="patient-field-row">
                <div className="patient-field">
                <label htmlFor="patient_id">Patient ID</label>
                <input type="text" />
                </div>
                <div className="patient-field">
                <label htmlFor="role">Role</label>
                <input type="text" />
                </div>
            </div>

            <div className="patient-field-row">
                <div className="patient-field">
                <label htmlFor="first-name">First Name</label>
                <input type="text" />
                </div>
                <div className="patient-field">
                <label htmlFor="last-name">Last Name</label>
                <input type="text" />
                </div>
            </div>

            <div className="patient-field-row">
                <div className="patient-field">
                <label htmlFor="gender">Gender</label>
                <input type="text" />
                </div>
                <div className="patient-field">
                <label htmlFor="marital-status">Marital Status</label>
                <input type="text" />
                </div>
            </div>

            <div className="patient-field-row">
                <div className="patient-field">
                <label htmlFor="dob">Date of Birth</label>
                <input type="date" />
                </div>
                <div className="patient-field">
                <label htmlFor="age">Age</label>
                <input type="text" />
                </div>
            </div>
        </>
      )}

        
      
    </>
  );
}

export default BasicInfoTab;
