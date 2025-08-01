import React, { useState } from 'react';
import './SubjectiveDetails.css'
import body_image from '../../assets/body-sketch.png'
import PainAssessmentSketch from './PainAssessmentSketch';
// import MedicalImageAnnotator from './MedicalImageAnnotator';
import SubjectiveDetails from './SubjectiveDetails';
import ObjectiveDetails from './ObjectiveDetails';



function Physio() {
  const TABS = ['Subjective', 'Objective'];
  const [activeSelection, setActiveSelection] = useState(TABS[0])
  const [selection, setSelection] = useState('Present Medical History'); 
  const [expandedIndex, setExpandedIndex] = useState(null);

  const history_data = [
    {
      date: "25th June, 2025",
      description:
        "Twisted ankle while stepping off a curb. Swelling started immediately. Could not put weight on foot.",
    },
    {
      date: "28th June, 2025",
      description:
        "Lower back pain after lifting a heavy box. Pain worsens when bending or standing for long.",
    },
    {
      date: "30th June, 2025",
      description:
        "Sharp pain in right shoulder after sudden throw during cricket match. Limited arm movement.",
    },
    {
      date: "2nd July, 2025",
      description:
        "Neck stiffness after sleeping in awkward position. Difficulty turning head to the left.",
    },
    {
      date: "5th July, 2025",
      description:
        "Left knee pain after jogging. Slight swelling noticed. Pain increases while climbing stairs.",
    },
  ];

  function truncateWords(text, wordLimit) {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + " ...";
  }

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

      {activeSelection === 'Subjective' && (
        <SubjectiveDetails />
          
      )}

      {activeSelection === 'Objective' && (
        <ObjectiveDetails />
      )}
    </div>
  );
}

export default Physio;
