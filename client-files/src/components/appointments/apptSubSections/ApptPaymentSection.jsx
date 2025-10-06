import axios from 'axios';
import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { useAuth } from "../../context/AuthContext";


function ApptPaymentSection({ patientData, updatePatientData, isReadOnly }) {

    return (
        <div>
            <h2 className='appointment-details-sub-heading'>Payment</h2>

            <div className="data-field-row">
                <div className="data-field data-field-2">
                    <label>Payment Status</label>
                    <select
                        id="pymt_status"
                        value={patientData.pymt_status ?? ''}
                        onChange={(e) => updatePatientData({ pymt_status: e.target.value })}
                        disabled={isReadOnly}
                    >
                        <option value="" disabled hidden>Select Status</option>
                        <option value="Not Billed">Not Billed</option>
                        <option value="Billed">Billed</option>
                        <option value="Paid">Paid</option>
                    </select>
                </div>
                <div className="data-field data-field-2">
                    <label>Payment Method</label>
                    <select
                        id="pymt_method"
                        value={patientData.pymt_method ?? ''}
                        onChange={(e) => updatePatientData({ pymt_method: e.target.value })}
                        disabled={isReadOnly}
                    >
                        <option value="" disabled hidden>Select Status</option>                       
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="UPI">UPI</option>
                        <option value="None">None</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default ApptPaymentSection;
