import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaRegCalendarCheck, FaSearch, FaFileInvoice, FaEye } from 'react-icons/fa';
import axios from 'axios';

import { useAuth } from "../../context/AuthContext";
import PaginationFooter from '../common/PaginationFooter';
import './AppointmentsPage.css';
import InvoiceModal from '../appointments/apptSubSections/InvoiceModal'

// import TableModule from '../commonModules/TableModule'

const API_URL = import.meta.env.VITE_API_URL

function AppointmentsPage() {
  const navigate = useNavigate();
  const { role, userId, branchId } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState({})
  const [selectedApptId, setSelectedApptId] = useState(null);

  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const statuses = ['Completed', 'Upcoming', 'Cancelled', 'Rescheduled'];

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const payload = {
        branch_id: branchId,
        page: currentPage,
        limit: appointmentsPerPage,
        search: searchTerm,
        status: filterStatus,
      };

      if (role !== "Admin" && role !== "Receptionist") {
        payload.practitioner_id = userId;
      }

      const response = await axios.post(`${API_URL}/api/appointments/get-all-appointments-list`, payload);
      const { data, total, totalPages } = response.data;

      setAppointments(data);
      setTotalAppointments(total);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments whenever filters or page change
  useEffect(() => {
    fetchAppointments();
  }, [currentPage, searchTerm, filterStatus]);

  // Reset page when search or status changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);


  // if (loading) { return <p></p>; }
  return (
    <div className="common-page-layout">
      <div className="common-page-header">
        <h1>Appointments</h1>

        <div className="filters">
          {(role == "Admin" || role == "Receptionist") && <button className='primary-button' onClick={() => navigate("/addAppointment")}>New Appointment</button>}

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
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

      <div className="common-table-wrapper">
        <table className="common-table">
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "160px" }} />
            <col style={{ width: "40px" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "30px" }} />
            <col style={{ width: "30px" }} />
            <col style={{ width: "30px" }} />
            <col style={{ width: "30px" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Appt ID</th>
              <th>Patient Names</th>
              <th>Patient ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Session</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.patient_name}</td>
                <td>{appointment.patient_id}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.session_type}</td>
                <td>{appointment.pymt_status}</td>
                <td>
                  <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className='commn-table-action-td'>
                  <div className='common-table-action-btn-layout'>
                    <FaEye
                      className='common-table-action-btn'
                      onClick={() => navigate(`/appointmentDetails/${appointment.patient_id}/${appointment.id}`)}
                    />
                  </div>
                  {(role == "Admin" || role == "Receptionist") && <div className='common-table-action-btn-layout'>
                    {appointment.invoice_url ? (
                      <FaFileInvoice
                        className='common-table-action-btn'
                        onClick={() => window.open(appointment.invoice_url, "_blank")}
                      />
                    ) : (
                      <FaFileInvoice
                        className='common-table-action-btn'
                        onClick={() => {
                          setSelectedAppt(appointment);
                          setSelectedApptId(appointment.id);
                          setShowInvoiceModal(true);
                        }}
                      />
                    )}
                  </div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {appointments.length == 0 && (
        <div className='appointments-default-message'>
          {/* <FaRegCalendarCheck className='appointments-default-logo' /> */}
          <div className='appointments-default-text'>No Appointments Yet</div>
        </div>
      )}

      {totalAppointments > 0 && (
        <div className="table-footer">
          <PaginationFooter
            page_count={`Showing ${(currentPage - 1) * appointmentsPerPage + 1} to ${Math.min(currentPage * appointmentsPerPage, totalAppointments)} of ${totalAppointments}`}
            playersPerPage={appointmentsPerPage}
            totalPlayers={totalAppointments}
            paginate={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}


      {showInvoiceModal && (
        <InvoiceModal patientData={selectedAppt} selectedApptId={selectedApptId} setShowInvoiceModal={setShowInvoiceModal} userId={userId} />
      )}
    </div>
  );
}

export default AppointmentsPage;