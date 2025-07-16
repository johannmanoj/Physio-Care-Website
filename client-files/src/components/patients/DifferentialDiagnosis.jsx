import React, { useState } from 'react';


function DifferentialDiagnosis() {
  const TABS = ['Special Tests', 'Provisional Diagnosis', 'Final Diagnosis'];
  const [activeSelection, setActiveSelection] = useState(TABS[0])

  return (
    <>
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
    </>
  );
}

export default DifferentialDiagnosis;
