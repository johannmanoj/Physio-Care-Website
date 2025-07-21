import React, { useState } from 'react';
import './SubjectiveDetails.css'
import body_image from '../../assets/body-sketch.png'
import PainAssessmentSketch from './PainAssessmentSketch';


function SubjectiveDetails() {
  const TABS = ['Demographic Data', 'History', 'Pain Assessment'];
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

      {activeSelection === 'Demographic Data' && (
        <>
          <br />
          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="Name">Name</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="occupation">Occupation</label>
              <input type="text" />
            </div>
          </div>

          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="age">Age</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="gender">Gender</label>
              <input type="text" />
            </div>
          </div>

          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="phone">Phone</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="email">E-Mail</label>
              <input type="text" />
            </div>
          </div>

          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-1">
              <label htmlFor="address">Address</label>
              <input type="text" />
            </div>
          </div>
          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-1">
              <label htmlFor="chief_complaints">Chief Complaints</label>
              <input type="text" />
            </div>
          </div>
        </>
      )}

      {activeSelection === 'History' && (
        <div className='pain-assessment-card'>
          <div className='pain-assessment-dropdown-group'>
            <div className="form-group">
              <label htmlFor="history">History</label>
              <select
                id="history"
                value={selection}
                onChange={(e) => setSelection(e.target.value)}
              >
                <option value="Present Medical History">Present Medical History</option>
                <option value="Past Medical History">Past Medical History</option>
                <option value="Surgical History">Surgical History</option>
                <option value="Personal History">Personal History</option>
                <option value="Family History">Family History</option>
                <option value="Socio Economic History">Socio Economic History</option>
                <option value="Sports Specific History">Sports Specific History</option>
              </select>
            </div>
          </div>

          {selection === "Present Medical History" && (
            <div className='pain-assessment-card-text'>
              <div className="subjective-details-field-row">
                <div className="subjective-details-field subjective-details-field-1">
                  <label htmlFor="side">Side</label>
                  <input type="text" />
                </div>
              </div>
              <div className="subjective-details-field-row">
                <div className="subjective-details-field subjective-details-field-1">
                  <label htmlFor="site">Site</label>
                  <input type="text" />
                </div>
              </div>
              <div className="subjective-details-field-row">
                <div className="subjective-details-field subjective-details-field-1">
                  <label htmlFor="duration">Duration</label>
                  <input type="text" />
                </div>
              </div>
              <div className="subjective-details-field-row">
                <div className="subjective-details-field subjective-details-field-1">
                  <label htmlFor="mechanism">Mechanism</label>
                  <input type="text" />
                </div>
              </div>
              <div className="subjective-details-field-row">
                <div className="subjective-details-field subjective-details-field-1">
                  <label htmlFor="mode_of_onset">Mode Of Onset</label>
                  <input type="text" />
                </div>
              </div>
              <div className="subjective-details-field-row">
                <div className="subjective-details-field subjective-details-field-1">
                  <label htmlFor="aggravating_relieving_factor">Aggravating & Relieving Factor</label>
                  <input type="text" />
                </div>
              </div>
            </div>
          )}

          {selection != "Present Medical History" && (
            <div className='history-details-card'>
              <div className='history-details-card-header'>
                <div>
                  <label htmlFor="search">Search</label>
                  <input type="text" />
                </div>
                <div>
                  <label htmlFor="search">Date</label>
                  <input type="date" />
                </div>

              </div>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history_data.map((row, index) => {
                      const isExpanded = expandedIndex === index;
                      return (
                        <tr key={index}>
                          <td>{row.date}</td>
                          <td>
                            {isExpanded ? row.description : truncateWords(row.description, 4)}
                            <span
                              className="arrow-icon"
                              onClick={() =>
                                setExpandedIndex(isExpanded ? null : index)
                              }
                            >
                              {isExpanded ? " ▲" : " ▼"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}



        </div>
      )}

      {activeSelection === 'Pain Assessment' && (
        <div className='pain-assessment-card'>
          <div className='pain-assessment-card-text'>
            <br />
            <div className="subjective-details-field-row">
              <div className="subjective-details-field subjective-details-field-1">
                <label htmlFor="onset">Onset</label>
                <input type="text" />
              </div>
            </div>
            <div className="subjective-details-field-row">
              <div className="subjective-details-field subjective-details-field-1">
                <label htmlFor="side_and_site">Side & Site</label>
                <input type="text" />
              </div>
            </div>
            <div className="subjective-details-field-row">
              <div className="subjective-details-field subjective-details-field-1">
                <label htmlFor="type">Type</label>
                <input type="text" />
              </div>
            </div>
            <div className="subjective-details-field-row">
              <div className="subjective-details-field subjective-details-field-1">
                <label htmlFor="aggrating_relieving_factor">Aggrating & Relieving Factor</label>
                <input type="text" />
              </div>
            </div>
            <div className="subjective-details-field-row">
              <div className="subjective-details-field subjective-details-field-1">
                <label htmlFor="nocturnal_pain">Nocturnal Pain</label>
                <input type="text" />
              </div>
            </div>
            <div className="subjective-details-field-row">
              <div className="subjective-details-field subjective-details-field-1">
                <label htmlFor="intensity_of_pain">Intensity Of Pain</label>
                <input type="text" />
              </div>
            </div>

          
          </div>
          <div className='pain-assessment-image-group'>
            {/* <img src={body_image} alt="" /> */}
            <PainAssessmentSketch className="pain-assessment-image-group-sketch"/>
          </div>

        </div>
      )}
    </div>
  );
}

export default SubjectiveDetails;
