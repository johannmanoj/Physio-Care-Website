import React, { useState } from 'react';
import DicomViewernew from './dicomViewer';

function DifferentialDiagnosis() {
  const TABS = ['Special Test', 'Investigation'];
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
      {activeSelection === "Investigation" && (
        <DicomViewernew />
      )}
      
    </>
  );
}

export default DifferentialDiagnosis;
