import React, { useState, useEffect } from 'react';
import Pagination from '../common/Pagination';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { FaFileInvoice } from 'react-icons/fa';




const API_URL = import.meta.env.VITE_API_URL

function AppointmentsPage() {
    const navigate = useNavigate();
    const { patientId, patientName } = useParams();

    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [appointmentsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);


    const [invoices, setInvoices] = useState([])

    const { role, userId } = useAuth();

    const statuses = ['completed', 'upcoming', 'cancelled', 'rescheduled'];

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const payload =
                    role === "Admin"
                        ? { filter: "all" }
                        : { filter: "practitioner", practitioner_id: userId };

                const response = await axios.post(`${API_URL}/api/invoice/get-invoice-list`, payload);
                setInvoices(response.data.data);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [role, userId]);


    // Filtering and Searching Logic
    const filteredAppointments = invoices.filter(appointment => {
        const matchesSearch = appointment.practitioner_id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus ? appointment.status.toLowerCase() == filterStatus : true;

        return matchesSearch && matchesStatus;
    });

    // Pagination Logic
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
    const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

      if (loading) { return <p></p>; }


    return (
        <div className="players-page-container">
            <div className="page-header">
                {/* <h1>Patient: {patientId} ({patientName})</h1> */}
                <h1>Invoices</h1>
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

            <div className="table-wrapper">
                <table className="player-table">
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Appointment ID</th>
                            {role === "Admin" && <th>Practitioner ID</th>}
                            {/* <th>Practitioner ID</th> */}
                            <th>Patient ID</th>
                            <th>Invoice Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td>{invoice.id}</td>
                                <td>{invoice.appointment_id}</td>
                                {role === "Admin" && <td>{invoice.practitioner_id}</td>}
                                <td>{invoice.patient_id}</td>
                                <td>
                                    {new Date(invoice.created).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "2-digit",
                                    })}
                                </td>

                                <td>
                                    <button
                                        className="view-button"
                                        onClick={() => window.open(invoice.invoice_url, "_blank")}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {invoices.length == 0 && (
                <div className='appointments-default-message'>
                    <FaFileInvoice className='appointments-default-logo' />
                    <div className='appointments-default-text'>No Invoices Yet</div>
                </div>
            )}

            {invoices.length > 0 && (
                <div className="table-footer">
                    <span className="pagination-info">
                        Showing {indexOfFirstAppointment + 1} to {Math.min(indexOfLastAppointment, filteredAppointments.length)} of {filteredAppointments.length}
                    </span>
                    <Pagination
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

export default AppointmentsPage;