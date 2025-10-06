import React, { useState, useEffect } from 'react';
import Pagination from '../common/Pagination';
import PaginationFooter from '../common/PaginationFooter';

import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaRegCalendarCheck } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

function AppointmentReportSection({ user_id }) {
    const navigate = useNavigate();
    const { branchId } = useAuth();


    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [appointmentsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    const statuses = ['completed', 'upcoming', 'cancelled', 'rescheduled'];
    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                let response = await axios.post(`${API_URL}/api/appointments/get-appointments-list`, {
                    practitioner_id: user_id,
                    branch_id: branchId
                });
                setAppointments(response.data.data);
            } catch (error) {
                console.error("Error fetching appointments data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [user_id]);

    // Get unique years from appointments
    const years = Array.from(new Set(
        appointments.map(appt => new Date(appt.date).getFullYear())
    ));

    // Filtering and Searching Logic
    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus ? appointment.status.toLowerCase() === filterStatus : true;

        const apptDate = new Date(appointment.date);
        const matchesYear = selectedYear ? apptDate.getFullYear().toString() === selectedYear : true;
        const matchesMonth = selectedMonth ? (apptDate.getMonth() + 1).toString().padStart(2, '0') === selectedMonth : true;

        return matchesSearch && matchesStatus && matchesYear && matchesMonth;
    });

    // Pagination Logic
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
    const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    var page_count = `Showing ${indexOfFirstAppointment + 1} to ${Math.min(indexOfLastAppointment, filteredAppointments.length)} of ${filteredAppointments.length}`


    if (loading) { return <p></p>; }

    return (
        <div>
            <div className="common-page-header">
                <h1>Appointments</h1>

                <div className="filters">
                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">Filter by Status</option>
                        {statuses.map((team) => (
                            <option key={team} value={team}>{team}</option>
                        ))}
                    </select>

                    {/* Year Filter */}
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">All Years</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    {/* Month Filter */}
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        <option value="">All Months</option>
                        {months.map((m) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>

                    {/* Search */}
                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Search Name here..."
                            value={searchTerm}
                            className='search-input'
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="common-table-wrapper">
                <table className="common-table">
                    <thead>
                        <tr>
                            <th>Appt ID</th>
                            <th>Patient Names</th>
                            <th>Patient ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Session Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAppointments.map(appointment => (
                            <tr key={appointment.id}>
                                <td>{appointment.id}</td>
                                <td>{appointment.name}</td>
                                <td>{appointment.patient_id}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.session_type}</td>
                                <td>
                                    <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                                        {appointment.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="primary-button"
                                        onClick={() => navigate(`/appointmentDetails/${appointment.patient_id}/${appointment.id}`)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {appointments.length === 0 && (
                <div className='appointments-default-message'>
                    <FaRegCalendarCheck className='appointments-default-logo' />
                    <div className='appointments-default-text'>No Appointments Yet</div>
                </div>
            )}

            {appointments.length > 0 && (
                <div className="table-footer">
                    {/* <span className="pagination-info">
                        Showing {indexOfFirstAppointment + 1} to {Math.min(indexOfLastAppointment, filteredAppointments.length)} of {filteredAppointments.length}
                    </span>
                    <Pagination
                        playersPerPage={appointmentsPerPage}
                        totalPlayers={filteredAppointments.length}
                        paginate={paginate}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    /> */}
                    <PaginationFooter
                        page_count={page_count}
                        playersPerPage={appointmentsPerPage}
                        totalPlayers={filteredAppointments.length}
                        paginate={paginate}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                </div>
            )}
        </div>
    );
}

export default AppointmentReportSection;
