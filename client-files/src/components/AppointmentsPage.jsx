import React, { useState, useEffect } from 'react';
import AppointmentsTable from './AppointmentsTable';
import Pagination from '../components/Pagination';
import './AppointmentsPage.css';
import axios from 'axios';

function AppointmentsPage() {
  // const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(10); // As seen in the image "Showing 1 to 10 of 25"

  const teams = ['completed', 'upcoming', 'cancelled', 'rescheduled'];

  const players = [
    {
      id: 1,
      appointment_id: 'APT-1001',
      patient_name: 'Rahul Sharma',
      patient_id: 'P1001',
      date: '2025-06-28',
      time: '13:30:00',
      session_type: 'Follow-up',
      status: 'Completed'
    },
    {
      id: 2,
      appointment_id: 'APT-1002',
      patient_name: 'Sneha Iyer',
      patient_id: 'P1002',
      date: '2025-07-05',
      time: '09:30:00',
      session_type: 'Treatment',
      status: 'Completed'
    },
    {
      id: 3,
      appointment_id: 'APT-1003',
      patient_name: 'Arjun Patel',
      patient_id: 'P1003',
      date: '2025-07-09',
      time: '15:00:00',
      session_type: 'Assessment',
      status: 'Upcoming'
    },
    {
      id: 4,
      appointment_id: 'APT-1004',
      patient_name: 'Priya Nair',
      patient_id: 'P1004',
      date: '2025-06-24',
      time: '14:30:00',
      session_type: 'IPS Screening',
      status: 'Cancelled'
    },
    {
      id: 5,
      appointment_id: 'APT-1005',
      patient_name: 'Vikram Singh',
      patient_id: 'P1005',
      date: '2025-07-09',
      time: '17:00:00',
      session_type: 'IPS Screening',
      status: 'Cancelled'
    },
    {
      id: 6,
      appointment_id: 'APT-1006',
      patient_name: 'Kavita Rao',
      patient_id: 'P1006',
      date: '2025-06-27',
      time: '10:30:00',
      session_type: 'Assessment',
      status: 'Rescheduled'
    },
    {
      id: 7,
      appointment_id: 'APT-1007',
      patient_name: 'Rohan Mehta',
      patient_id: 'P1007',
      date: '2025-07-01',
      time: '15:00:00',
      session_type: 'Assessment',
      status: 'Cancelled'
    },
    {
      id: 8,
      appointment_id: 'APT-1008',
      patient_name: 'Anita Das',
      patient_id: 'P1008',
      date: '2025-07-07',
      time: '14:30:00',
      session_type: 'IPS Screening',
      status: 'Cancelled'
    },
    {
      id: 9,
      appointment_id: 'APT-1009',
      patient_name: 'Siddharth Gupta',
      patient_id: 'P1009',
      date: '2025-06-25',
      time: '14:00:00',
      session_type: 'Follow-up',
      status: 'Rescheduled'
    },
    {
      id: 10,
      appointment_id: 'APT-1010',
      patient_name: 'Neha Kapoor',
      patient_id: 'P1010',
      date: '2025-07-04',
      time: '10:00:00',
      session_type: 'Treatment',
      status: 'Rescheduled'
    },
    {
      id: 11,
      appointment_id: 'APT-1011',
      patient_name: 'Amitabh Reddy',
      patient_id: 'P1011',
      date: '2025-06-24',
      time: '17:30:00',
      session_type: 'IPS Screening',
      status: 'Upcoming'
    },
    {
      id: 12,
      appointment_id: 'APT-1012',
      patient_name: 'Pooja Chauhan',
      patient_id: 'P1012',
      date: '2025-07-01',
      time: '12:30:00',
      session_type: 'Assessment',
      status: 'Cancelled'
    },
    {
      id: 13,
      appointment_id: 'APT-1013',
      patient_name: 'Karan Malhotra',
      patient_id: 'P1013',
      date: '2025-06-28',
      time: '10:00:00',
      session_type: 'Treatment',
      status: 'Upcoming'
    },
    {
      id: 14,
      appointment_id: 'APT-1014',
      patient_name: 'Divya Joshi',
      patient_id: 'P1014',
      date: '2025-07-09',
      time: '09:30:00',
      session_type: 'Treatment',
      status: 'Cancelled'
    },
    {
      id: 15,
      appointment_id: 'APT-1015',
      patient_name: 'Manish Kumar',
      patient_id: 'P1015',
      date: '2025-07-04',
      time: '11:30:00',
      session_type: 'Follow-up',
      status: 'Completed'
    },
    {
      id: 16,
      appointment_id: 'APT-1016',
      patient_name: 'Anjali Menon',
      patient_id: 'P1016',
      date: '2025-06-24',
      time: '10:30:00',
      session_type: 'Assessment',
      status: 'Rescheduled'
    },
    {
      id: 17,
      appointment_id: 'APT-1017',
      patient_name: 'Harsh Vardhan',
      patient_id: 'P1017',
      date: '2025-06-26',
      time: '12:00:00',
      session_type: 'Assessment',
      status: 'Rescheduled'
    },
    {
      id: 18,
      appointment_id: 'APT-1018',
      patient_name: 'Simran Kaur',
      patient_id: 'P1018',
      date: '2025-07-02',
      time: '16:30:00',
      session_type: 'Assessment',
      status: 'Upcoming'
    },
    {
      id: 19,
      appointment_id: 'APT-1019',
      patient_name: 'Girish Bhat',
      patient_id: 'P1019',
      date: '2025-07-01',
      time: '12:30:00',
      session_type: 'Assessment',
      status: 'Upcoming'
    },
    {
      id: 20,
      appointment_id: 'APT-1020',
      patient_name: 'Ritu Jain',
      patient_id: 'P1020',
      date: '2025-07-06',
      time: '10:30:00',
      session_type: 'Follow-up',
      status: 'Rescheduled'
    },
    {
      id: 21,
      appointment_id: 'APT-1021',
      patient_name: 'Aditya Bhatt',
      patient_id: 'P1021',
      date: '2025-06-29',
      time: '15:00:00',
      session_type: 'Treatment',
      status: 'Rescheduled'
    },
    {
      id: 22,
      appointment_id: 'APT-1022',
      patient_name: 'Meera Verma',
      patient_id: 'P1022',
      date: '2025-07-03',
      time: '12:00:00',
      session_type: 'IPS Screening',
      status: 'Cancelled'
    },
    {
      id: 23,
      appointment_id: 'APT-1023',
      patient_name: 'Suresh Pillai',
      patient_id: 'P1023',
      date: '2025-06-30',
      time: '14:30:00',
      session_type: 'Treatment',
      status: 'Rescheduled'
    },
    {
      id: 24,
      appointment_id: 'APT-1024',
      patient_name: 'Farah Khan',
      patient_id: 'P1024',
      date: '2025-07-06',
      time: '15:00:00',
      session_type: 'Treatment',
      status: 'Upcoming'
    },
    {
      id: 25,
      appointment_id: 'APT-1025',
      patient_name: 'Raj Kumari',
      patient_id: 'P1025',
      date: '2025-07-07',
      time: '14:00:00',
      session_type: 'Assessment',
      status: 'Upcoming'
    }
  ]

  // useEffect(() => {
  //   axios.post('http://localhost:3000/api/players/get-appointment-list')
  //     .then((response) => {
  //       setPlayers(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching players data:', error);
  //     });
  // }, []);

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