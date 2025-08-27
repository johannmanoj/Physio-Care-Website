import React, { useState, useEffect } from 'react';
import AppointmentsTable from './AppointmentsTable';
import Pagination from './common/Pagination';
import './AppointmentsPage.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL

function AppointmentsPage() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10); // As seen in the image "Showing 1 to 10 of 25"

  const statuses = ['completed', 'upcoming', 'cancelled', 'rescheduled'];

  const { role, loginEmail, userId } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let response;

        if (role === "Admin" || role === "Receptionist") {
          // Admin → fetch all appointments
          response = await axios.post(`${API_URL}/api/appointments/get-appointments-list`);
        } else {
          // Non-admin → fetch only practitioner's appointments
          response = await axios.post(`${API_URL}/api/appointments/get-practitioner-appointments-list`, {
            practitioner_id: userId,
          });
        }

        setAppointments(response.data.data);
      } catch (error) {
        console.error("Error fetching appointments data:", error);
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



  return (
    <div className="players-page-container">
      <div className="page-header">
        <h1>Appointments</h1>

        <div className="filters">
          {role == "Admin" && <button className='view-button' onClick={() => navigate("/addAppointment")}>New Appointment</button>}
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
        </div>
      </div>

      <AppointmentsTable appointments={currentAppointments} />

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
    </div>
  );
}

export default AppointmentsPage;