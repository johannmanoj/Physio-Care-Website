import React from 'react'
import { useNavigate } from "react-router-dom";
import { FaRegCalendarCheck, FaFileInvoice, FaDumbbell , FaStarOfLife , FaStethoscope } from 'react-icons/fa';

import { MdPeople } from 'react-icons/md';

// import './ReportsPage.css'


const LibrariesPage = () => {
    const navigate = useNavigate();

    return (
        <div className='report-page'>
            <h1>Libraries</h1>
            <div className='report-selection-card-grid'>
                <div className='report-selection-card-row'>
                    <div className='report-selection-card'>
                        <FaDumbbell />
                        <label>Exercises</label>
                        <button onClick={() => navigate(`/exerciseLibPage`)}>View</button>
                        
                    </div>
                    <div className='report-selection-card'>
                        <FaStethoscope />
                        <label>Treatments</label>
                        <button onClick={() => navigate(`/treatmentLibPage`)}>View</button>
                    </div>
                    {/* <div className='report-selection-card'>
                        <FaFileInvoice />
                        <label>Invoices</label>
                        <button onClick={() => navigate(`/invoiceReportPage`)}>View</button>
                    </div> */}
                </div>

                {/* <div className='report-selection-card-row'>
                    <div className='report-selection-card'>
                        <FaRegCalendarCheck />
                        <label>Attendance</label>
                        <button>View</button>
                    </div>
                    <div className='report-selection-card'>
                        <FaRegCalendarCheck />
                        <label>Attendance</label>
                        <button>View</button>
                    </div>
                    <div className='report-selection-card'>
                        <FaRegCalendarCheck />
                        <label>Attendance</label>
                        <button>View</button>
                    </div>
                </div> */}

            </div>
        </div>
    )
}

export default LibrariesPage