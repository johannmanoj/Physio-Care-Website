import React, { useState } from 'react';


function MedicalInfoTab() {
  const TABS = ['Vital Signs', 'Motor Assessment', 'Sensory Assessment'];
  const [activeSelection , setActiveSelection] = useState(TABS[0])

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

export default MedicalInfoTab;
