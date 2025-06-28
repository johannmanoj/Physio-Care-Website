import React, { useState, useEffect } from 'react';
import AppointmentsTable from './AppointmentsTable';
import Pagination from '../components/Pagination';
import './AppointmentsPage.css';
import axios from 'axios';

function AppointmentsPage() {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(10); // As seen in the image "Showing 1 to 10 of 25"

  const teams = ['completed', 'upcoming', 'cancelled', 'rescheduled'];

  useEffect(() => {
    axios.post('http://localhost:3000/api/players/get-players-list')
      .then((response) => {
        setPlayers(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching players data:', error);
      });
  }, []);

  // Filtering and Searching Logic
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.patient_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTeam = filterTeam ? player.status.toLowerCase() == filterTeam : true;

    return matchesSearch && matchesTeam;
  });

  // Pagination Logic
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="players-page-container">
      <div className="page-header">
        <h1>Appointments</h1>
        <div className="filters">
          
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
          >
          <option value="">Filter by Status</option>
          {teams.map((team) => (
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

      <AppointmentsTable players={currentPlayers} />

      <div className="table-footer">
        <span className="pagination-info">
          Showing {indexOfFirstPlayer + 1} to {Math.min(indexOfLastPlayer, filteredPlayers.length)} of {filteredPlayers.length}
        </span>
        <Pagination
          playersPerPage={playersPerPage}
          totalPlayers={filteredPlayers.length}
          paginate={paginate}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

export default AppointmentsPage;