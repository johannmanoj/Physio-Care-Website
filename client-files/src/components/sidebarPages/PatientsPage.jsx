import React, { useState, useEffect } from 'react';
import Pagination from '../common/Pagination';
import './PatientsPage.css';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";


import { FaUserInjured } from 'react-icons/fa';


const API_URL = import.meta.env.VITE_API_URL

function PatientsPage() {
  const { branchId } = useAuth();

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const statuses = ['active', 'inactive', 'onhold'];

  useEffect(() => {
    axios
      .post(`${API_URL}/api/patients/get-patient-list`, {
        branch_id: branchId
      })
      .then((response) => {
        setPatients(response.data.data || []); // make sure it's always an array
      })
      .catch((error) => {
        console.error("Error fetching patients data:", error);
      })
      .finally(() => {
        setLoading(false); // ✅ stop loading after request finishes
      });
  }, []);


  // Filtering and Searching Logic
  const filteredPatients = patients.filter(patient => {
    // console.log("patientpatientpatient", patient);

    const matchesSearch = patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus ? patient.status.toLowerCase() == filterStatus : true;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastPlayer = currentPage * patientsPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) { return <p></p>; }
  return (
    <div className="patients-page-container">
      <div className="page-header">
        <h1>Patients</h1>
        <div className="filters">

          {/* <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Filter by Status</option>
            {statuses.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select> */}
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
              <th>Patient ID</th>
              <th>Name</th>
              <th>Sex</th>
              <th>Age</th>
              <th>Contact Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.patient_name}</td>
                <td>{patient.sex}</td>
                <td>{patient.age}</td>
                <td>{patient.contact_num}</td>
                <td>
                  <button className="view-button" onClick={() => navigate(`/patientAppointments/${patient.id}/${patient.patient_name}`)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {patients.length == 0 && (
        <div className='appointments-default-message'>
          <FaUserInjured className='appointments-default-logo' />
          <div className='appointments-default-text'>No Patients Yet</div>
        </div>
      )}

      {patients.length > 0 && (
        <div className="table-footer">
          <span className="pagination-info">
            Showing {indexOfFirstPlayer + 1} to {Math.min(indexOfLastPlayer, filteredPatients.length)} of {filteredPatients.length}
          </span>
          <Pagination
            playersPerPage={patientsPerPage}
            totalPlayers={filteredPatients.length}
            paginate={paginate}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}

export default PatientsPage;