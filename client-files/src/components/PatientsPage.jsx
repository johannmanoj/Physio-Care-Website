import React, { useState, useEffect } from 'react';
import PatientsTable from './PatientsTable';
import Pagination from './common/Pagination';
import './PatientsPage.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10); 

  const statuses = ['active', 'inactive', 'onhold'];

  useEffect(() => {
    axios.post(`${API_URL}/api/patients/get-patient-list`)
      .then((response) => {
        setPatients(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching players data:', error);
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
              placeholder="Search here..."
              value={searchTerm}
              className='search-input'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <PatientsTable patients={currentPatients} />

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
    </div>
  );
}

export default PatientsPage;