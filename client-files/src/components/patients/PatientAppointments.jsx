import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

import { useAuth } from "../../context/AuthContext";
import PaginationFooter from '../common/PaginationFooter';

const API_URL = import.meta.env.VITE_API_URL

function PatientAppointments() {
    const navigate = useNavigate();
    const { branchId } = useAuth();
    const { patientId, patientName } = useParams();

    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [appointmentsPerPage] = useState(10);

    const statuses = ['completed', 'upcoming', 'cancelled', 'rescheduled'];


    useEffect(() => {
        axios.post(`${API_URL}/api/appointments/get-patient-appointment-list`, {
            "patient_id": patientId,
            "branch_id": branchId
        })
            .then((response) => {
                setAppointments(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching players data:', error);
            });
    }, []);


    // Filtering and Searching Logic
    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus ? appointment.status.toLowerCase() == filterStatus : true;

        return matchesSearch && matchesStatus;
    });

    // Pagination Logic
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
    const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    var page_count = `Showing ${indexOfFirstAppointment + 1} to ${Math.min(indexOfLastAppointment, filteredAppointments.length)} of ${filteredAppointments.length}`


    return (
        <div className="common-page-layout">
            <div className="common-page-header">
                <h1>Patient: {patientId} ({patientName})</h1>
                {/* <div className="filters">

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">Filter by Status</option>
                        {statuses.map((team) => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Search here..."
                            value={searchTerm}
                            className='search-input'
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div> */}
            </div>

            <div className="common-table-wrapper">
                <table className="common-table">
                    <thead>
                        <tr>
                            <th>Appt ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Session Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(appointment => (
                            <tr key={appointment.id}>
                                <td>{appointment.id}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.session_type}</td>
                                <td>
                                    <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                                        {appointment.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="primary-button" onClick={() => navigate(`/appointmentDetails/${appointment.patient_id}/${appointment.id}`)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-footer">
                <PaginationFooter
                    page_count={page_count}
                    playersPerPage={appointmentsPerPage}
                    totalPlayers={filteredAppointments.length}
                    paginate={paginate}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}

export default PatientAppointments;