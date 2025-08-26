import React, { useState } from 'react';

function TreatmentGoal({ data, onDataChange }) {
  const TABS = ['Goal', 'Program'];
  const [activeSelection, setActiveSelection] = useState(TABS[0])

  return (
    <>
      <nav className="sub-heading-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSelection(tab)}
            className={`sub-heading-tab ${activeSelection === tab ? 'sub-heading-tab--active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </nav>
      {activeSelection === "Goal" && (
        <div className="data-field-row">
          <div className="data-field data-field-1">
            <label htmlFor="Desciption">Desciption</label>
            <textarea
              name="subjective_desc"
              value={data.goal_desc}
              onChange={(e) =>
                onDataChange({ goal_desc: e.target.value })
              }
              placeholder="Enter Goals description"
            />
          </div>
        </div>
      )}
      {activeSelection === "Program" && (
        <div className="data-field-row">
          <div className="data-field data-field-1">
            <label htmlFor="Desciption">Desciption</label>
            <textarea
              name="subjective_desc"
              value={data.program_desc}
              onChange={(e) =>
                onDataChange({ program_desc: e.target.value })
              }
              placeholder="Enter program description"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default TreatmentGoal;
