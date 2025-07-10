import React, { useState } from 'react';
import './SubjectiveDetails.css'
import body_image from '../../assets/body-sketch.png'  



function SubjectiveDetails() {
    const TABS = ['Demographic Data', 'History', 'Pain Assessment'];
    const [activeSelection , setActiveSelection] = useState(TABS[0])
    const [selection, setSelection] = useState('Present History'); // Default role

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
            
            <table>
              <tbody id="itemsBody" className="billing-table-body">
                <tr>
                  <th>Date</th>
                  <td>
                    <div>25th June, 2025</div>
                  </td>                  
                </tr>
                <tr>
                  <th>Description</th>
                  <td>
                    <div>Pain in the right knee from yesterday morning onwards. Couldnt walk or run.Started pain after hitting a wall two days back.</div>
                  </td>                  
                </tr>
              </tbody>
              <tbody id="itemsBody" className="billing-table-body">
                <tr>
                  <th>Date</th>
                  <td>
                    <div>25th June, 2025</div>
                  </td>                  
                </tr>
                <tr>
                  <th>Description</th>
                  <td>
                    <div>Pain in the right knee from yesterday morning onwards. Couldnt walk or run.Started pain after hitting a wall two days back.</div>
                  </td>                  
                </tr>
              </tbody>
              <tbody id="itemsBody" className="billing-table-body">
                <tr>
                  <th>Date</th>
                  <td>
                    <div>25th June, 2025</div>
                  </td>                  
                </tr>
                <tr>
                  <th>Description</th>
                  <td>
                    <div>Pain in the right knee from yesterday morning onwards. Couldnt walk or run.Started pain after hitting a wall two days back.</div>
                  </td>                  
                </tr>
              </tbody>
              

              
               
              
            </table>
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
            <img src={body_image} alt="" />
          </div>
          
        </div>
      )}
    </div>
  );
}

export default SubjectiveDetails;
