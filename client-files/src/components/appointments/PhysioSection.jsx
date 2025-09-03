import { React, useEffect, useState } from 'react';
import body_icon from '../../assets/body-icon.png'


function PhysioSection({ patientData, updatePatientData, setShowSketchModal, isReadOnly }) {


    return (
        <div>
            <h2 className='appointment-details-sub-heading'>Physio</h2>

            <div className="data-field-row">
                <div className="appointment-field appointment-field-2">
                    <label htmlFor="Subjective">Subjective</label>
                    <textarea
                        name="subjective_desc"
                        value={patientData.subjective_desc ?? ''}
                        onChange={(e) => updatePatientData({ subjective_desc: e.target.value })}
                        placeholder="Enter subjective description"
                        disabled={isReadOnly}
                    />
                </div>
                <div className="appointment-field appointment-field-2">
                    <label htmlFor="Desciption">On Examination</label>
                    <textarea
                        name="onexamination_desc"
                        value={patientData.onexamination_desc ?? ''}
                        onChange={(e) => updatePatientData({ onexamination_desc: e.target.value })}
                        // placeholder={`On-examination description:
                        //     • Muscle Strength(MMT)
                        //     • Muscle Power
                        //     • Limb Length Discrepancies (UL)
                        //     • Any Other Findings
                        //     `
                        // }
                        placeholder={`On-examination description`
                        }
                        disabled={isReadOnly}
                        style={{ textAlign: 'left' }}
                    />
                </div>
            </div>
            <div className='data-field-row'>
                <div className='data-field data-field-1'>
                    <button
                        className='appointment-pain-assessment-button'
                        onClick={() => setShowSketchModal(true)}
                        disabled={isReadOnly}
                    >
                        <img className="appointment-pain-assessment-button-logo" src={body_icon} alt="" />
                        Pain Assessment
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PhysioSection;
