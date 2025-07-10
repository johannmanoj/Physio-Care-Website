import React, { useState } from 'react';


function TreatmentGoal() {
  const TABS = ['Short Term', 'Long Term', 'Treatment Plan', 'Home Programs', 'Date of Evaluation'];
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

export default TreatmentGoal;
