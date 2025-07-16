import React, { useState } from 'react';
import './ObjectiveDetails.css'
import head_image from '../../assets/head-sketch.png'


function ContactInfoTab() {
  const TABS = ['On Observation', 'On Palpation'];
  const [activeSelection, setActiveSelection] = useState(TABS[0])

  return (
    <div className='objective-details-page'>
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

      {activeSelection === 'On Observation' && (
        <>
          <div className="objective-details-field-row">
            <div className="objective-details-field objective-details-field-2">
              <label htmlFor="build">Build</label>
              <input type="text" />
            </div>
            <div className="objective-details-field objective-details-field-2">
              <label htmlFor="posture">Posture</label>
              <input type="text" />
            </div>
          </div>
          <div className="objective-details-field-row">
            <div className="objective-details-field objective-details-field-1">
              <label htmlFor="head-neck-position">Head & Neck Position</label>
              <input type="text" />
            </div>
          </div>

          <div className='on-observation-header'>
            <h3>Structural Or Functional Deformities</h3>
          </div>



          <div className='objective-fields-layout'>
            <div className='objective-fields-text'>
              <div className="objective-details-field-row">
                <div className="objective-details-field objective-details-field-1">
                  <label htmlFor="shoulder-levels">Shoulder Levels</label>
                  <input type="text" />
                </div>
              </div>
              <div className="objective-details-field-row">
                <div className="objective-details-field objective-details-field-1">
                  <label htmlFor="craniovertebral-angle">Craniovertebral Angle</label>
                  <input type="text" />
                </div>
              </div>
              <div className="objective-details-field-row">
                <div className="objective-details-field objective-details-field-1">
                  <label htmlFor="Bony And Soft Tissue Contours">Bony And Soft Tissue Contours</label>
                  <input type="text" />
                </div>
              </div>
              <div className="objective-details-field-row">
                <div className="objective-details-field objective-details-field-1">
                  <label htmlFor="Oedema/Swelling Or Trophic Changes">Oedema/Swelling Or Trophic Changes</label>
                  <input type="text" />
                </div>
              </div>
              <div className="objective-details-field-row">
                <div className="objective-details-field objective-details-field-1">
                  <label htmlFor="Muscle Wasting">Muscle Wasting</label>
                  <input type="text" />
                </div>
              </div>
              <div className="objective-details-field-row">
                <div className="objective-details-field objective-details-field-1">
                  <label htmlFor="Attitude Of Upperlimb">Attitude Of Upperlimb</label>
                  <input type="text" />
                </div>
              </div>
              <div className="objective-details-field-row">
                <div className="objective-details-field objective-details-field-1">
                  <label htmlFor="Evidence Of Ischemia Of Upperlimb">Evidence Of Ischemia Of Upperlimb</label>
                  <input type="text" />
                </div>
              </div>
            </div>
            <div className='on-palpation-image-group'>
              <img src={head_image} alt="" />
            </div>
          </div>



        </>
      )}
      {activeSelection === 'On Palpation' && (
        <>
          <div className="objective-details-field-row">
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="tenderness">Tenderness</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="type-of-skin">Type Of Skin</label>
              <input type="text" />
            </div>
          </div>

          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="temp-variation-of-skin">Temperature Variation Of Skin</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="scar">Scar</label>
              <input type="text" />
            </div>
          </div>

          <div className="subjective-details-field-row">
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="gender">Crepitus</label>
              <input type="text" />
            </div>
            <div className="subjective-details-field subjective-details-field-2">
              <label htmlFor="marital-status">Trigger Points</label>
              <input type="text" />
            </div>
          </div>


        </>
      )}
    </div>
  );
}

export default ContactInfoTab;
