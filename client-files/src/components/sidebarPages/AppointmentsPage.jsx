import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaRegCalendarCheck } from 'react-icons/fa';
import axios from 'axios';

import TableModule from '../commonModules/TableModule'

import { useAuth } from "../../context/AuthContext";
import Pagination from '../common/Pagination';
import './AppointmentsPage.css';

const API_URL = import.meta.env.VITE_API_URL

function AppointmentsPage() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const statuses = ['completed', 'upcoming', 'cancelled', 'rescheduled'];
  
  const { role, userId, branchId } = useAuth();
  

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let response;

        if (role === "Admin" || role === "Receptionist") {
          response = await axios.post(`${API_URL}/api/appointments/get-appointments-list`,{
            branch_id:branchId
          });
        } else {
          response = await axios.post(`${API_URL}/api/appointments/get-appointments-list`, {
            practitioner_id: userId,
            branch_id:branchId
          });
        }

        setAppointments(response.data.data);
      } catch (error) {
        console.error("Error fetching appointments data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [role, userId]);


  // Filtering and Searching Logic
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1>Appointments</h1>

        <div className="filters">
          {(role == "Admin" || role == "Receptionist") && <button className='view-button' onClick={() => navigate("/addAppointment")}>New Appointment</button>}
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
              placeholder="Search Name here..."
              value={searchTerm}
              className='search-input'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* <TableModule appointments={currentAppointments} /> */}

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
                  <button className="view-button" onClick={() => navigate(`/appointmentDetails/${appointment.patient_id}/${appointment.id}`)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>



      {appointments.length == 0 && (
        <div className='appointments-default-message'>
          <FaRegCalendarCheck className='appointments-default-logo' />
          <div className='appointments-default-text'>No Appointments Yet</div>
        </div>
      )}

      {appointments.length > 0 && (
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