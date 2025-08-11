import React, { useState } from 'react';
import './SubjectiveDetails.css'
import SubjectiveDetails from './SubjectiveDetails';
import ObjectiveDetails from './ObjectiveDetails';

function Physio({ data, onDataChange }) {
  const TABS = ['Subjective', 'Objective'];
  const [activeSelection, setActiveSelection] = useState(TABS[0])

  return (
    <div className='subjective-details-page'>
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

      {activeSelection === 'Subjective' && ( <SubjectiveDetails data={data} onDataChange={onDataChange} /> )}
      {activeSelection === 'Objective' && ( <ObjectiveDetails data={data} onDataChange={onDataChange} /> )}

    </div>
  );
}

export default Physio;
