import React from 'react'
import { useNavigate } from "react-router-dom";
import { FaRegCalendarCheck, FaFileInvoice } from 'react-icons/fa';
import { MdPeople } from 'react-icons/md';

import './ReportsPage.css'


const ReportsPage = () => {
    const navigate = useNavigate();

    return (
        <div className='report-page'>
            <h1>Reports</h1>
            <div className='report-selection-card-grid'>
                <div className='report-selection-card-row'>
                    <div className='report-selection-card'>
                        <MdPeople />
                        <label>Attendance</label>
                        <button onClick={() => navigate(`/attendanceReports`)}>View</button>
                        
                    </div>
                    <div className='report-selection-card'>
                        <FaRegCalendarCheck />
                        <label>Appointments</label>
                        <button onClick={() => navigate(`/appointmentReportPage`)}>View</button>
                    </div>
                    <div className='report-selection-card'>
                        <FaFileInvoice />
                        <label>Invoices</label>
                        <button onClick={() => navigate(`/invoiceReportPage`)}>View</button>
                    </div>
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

export default ReportsPage