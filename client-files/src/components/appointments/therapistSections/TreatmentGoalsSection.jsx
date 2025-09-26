import axios from 'axios';
import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { useAuth } from "../../context/AuthContext";


function TreatmentGoalsSection({ patientData, updatePatientData, isReadOnly }) {

    return (
        <div>
            <h2 className='appointment-details-sub-heading'>Treatment Goals</h2>

            <div className="data-field-row">
                <div className="data-field data-field-2">
                    <label>Goal</label>
                    <textarea
                        name="goal_desc"
                        value={patientData.goal_desc ?? ''}
                        onChange={(e) => updatePatientData({ goal_desc: e.target.value })}
                        placeholder="Enter Goals description"
                        disabled={isReadOnly}
                    />
                </div>
                <div className="data-field data-field-2">
                    <label>Program</label>
                    <textarea
                        name="program_desc"
                        value={patientData.program_desc ?? ''}
                        onChange={(e) => updatePatientData({ program_desc: e.target.value })}
                        placeholder="Enter program description"
                        disabled={isReadOnly}
                    />
                </div>
            </div>
        </div>
    )
}

export default TreatmentGoalsSection;
