import React, { useState, useEffect } from 'react';
import PatientsTable from './PatientsTable';
import Pagination from './common/Pagination';
import './PatientsPage.css';
import axios from 'axios';

function PatientsPage() {
  // const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(10); // As seen in the image "Showing 1 to 10 of 25"

  const teams = ['active', 'inactive', 'onhold'];

  const players = [
    {
      id: 1,
      patient_id: 'P1001',
      name: 'Rahul Sharma',
      gender: 'Male',
      age: '29',
      contact_number: '9876543100',
      last_visit: '2025-06-28',
      status: 'Active'
    },
    {
      id: 2,
      patient_id: 'P1002',
      name: 'Sneha Iyer',
      gender: 'Female',
      age: '34',
      contact_number: '9876543101',
      last_visit: '2025-07-05',
      status: 'Active'
    },
    {
      id: 3,
      patient_id: 'P1003',
      name: 'Arjun Patel',
      gender: 'Male',
      age: '27',
      contact_number: '9876543102',
      last_visit: '2025-07-09',
      status: 'OnHold'
    },
    {
      id: 4,
      patient_id: 'P1004',
      name: 'Priya Nair',
      gender: 'Female',
      age: '31',
      contact_number: '9876543103',
      last_visit: '2025-06-24',
      status: 'Inactive'
    },
    {
      id: 5,
      patient_id: 'P1005',
      name: 'Vikram Singh',
      gender: 'Male',
      age: '42',
      contact_number: '9876543104',
      last_visit: '2025-07-09',
      status: 'Active'
    },
    {
      id: 6,
      patient_id: 'P1006',
      name: 'Kavya Menon',
      gender: 'Female',
      age: '25',
      contact_number: '9876543105',
      last_visit: '2025-06-30',
      status: 'Active'
    },
    {
      id: 7,
      patient_id: 'P1007',
      name: 'Rohit Desai',
      gender: 'Male',
      age: '33',
      contact_number: '9876543106',
      last_visit: '2025-07-02',
      status: 'Inactive'
    },
    {
      id: 8,
      patient_id: 'P1008',
      name: 'Ananya Rao',
      gender: 'Female',
      age: '28',
      contact_number: '9876543107',
      last_visit: '2025-07-03',
      status: 'Active'
    },
    {
      id: 9,
      patient_id: 'P1009',
      name: 'Siddharth Verma',
      gender: 'Male',
      age: '36',
      contact_number: '9876543108',
      last_visit: '2025-06-27',
      status: 'OnHold'
    },
    {
      id: 10,
      patient_id: 'P1010',
      name: 'Neha Joshi',
      gender: 'Female',
      age: '30',
      contact_number: '9876543109',
      last_visit: '2025-07-01',
      status: 'Active'
    },
    {
      id: 11,
      patient_id: 'P1011',
      name: 'Karan Kapoor',
      gender: 'Male',
      age: '40',
      contact_number: '9876543110',
      last_visit: '2025-06-29',
      status: 'Inactive'
    },
    {
      id: 12,
      patient_id: 'P1012',
      name: 'Aditi Mishra',
      gender: 'Female',
      age: '26',
      contact_number: '9876543111',
      last_visit: '2025-07-06',
      status: 'Active'
    },
    {
      id: 13,
      patient_id: 'P1013',
      name: 'Mohan Kumar',
      gender: 'Male',
      age: '48',
      contact_number: '9876543112',
      last_visit: '2025-06-23',
      status: 'Active'
    },
    {
      id: 14,
      patient_id: 'P1014',
      name: 'Riya Gupta',
      gender: 'Female',
      age: '22',
      contact_number: '9876543113',
      last_visit: '2025-07-07',
      status: 'OnHold'
    },
    {
      id: 15,
      patient_id: 'P1015',
      name: 'Deepak Reddy',
      gender: 'Male',
      age: '35',
      contact_number: '9876543114',
      last_visit: '2025-06-25',
      status: 'Active'
    },
    {
      id: 16,
      patient_id: 'P1016',
      name: 'Pooja Mehta',
      gender: 'Female',
      age: '32',
      contact_number: '9876543115',
      last_visit: '2025-06-26',
      status: 'Inactive'
    },
    {
      id: 17,
      patient_id: 'P1017',
      name: 'Ajay Bansal',
      gender: 'Male',
      age: '37',
      contact_number: '9876543116',
      last_visit: '2025-07-04',
      status: 'Active'
    },
    {
      id: 18,
      patient_id: 'P1018',
      name: 'Isha Shah',
      gender: 'Female',
      age: '29',
      contact_number: '9876543117',
      last_visit: '2025-07-08',
      status: 'Active'
    },
    {
      id: 19,
      patient_id: 'P1019',
      name: 'Manish Jain',
      gender: 'Male',
      age: '41',
      contact_number: '9876543118',
      last_visit: '2025-06-22',
      status: 'Inactive'
    },
    {
      id: 20,
      patient_id: 'P1020',
      name: 'Divya Kaur',
      gender: 'Female',
      age: '27',
      contact_number: '9876543119',
      last_visit: '2025-06-21',
      status: 'Active'
    },
    {
      id: 21,
      patient_id: 'P1021',
      name: 'Rakesh Das',
      gender: 'Male',
      age: '38',
      contact_number: '9876543120',
      last_visit: '2025-06-30',
      status: 'OnHold'
    },
    {
      id: 22,
      patient_id: 'P1022',
      name: 'Tanvi Kulkarni',
      gender: 'Female',
      age: '24',
      contact_number: '9876543121',
      last_visit: '2025-07-02',
      status: 'Active'
    },
    {
      id: 23,
      patient_id: 'P1023',
      name: 'Sandeep Yadav',
      gender: 'Male',
      age: '31',
      contact_number: '9876543122',
      last_visit: '2025-07-03',
      status: 'Inactive'
    },
    {
      id: 24,
      patient_id: 'P1024',
      name: 'Shreya Ghosh',
      gender: 'Female',
      age: '28',
      contact_number: '9876543123',
      last_visit: '2025-07-05',
      status: 'Active'
    },
    {
      id: 25,
      patient_id: 'P1025',
      name: 'Ashwin Pillai',
      gender: 'Male',
      age: '45',
      contact_number: '9876543124',
      last_visit: '2025-06-28',
      status: 'Active'
    }
  ]

  // useEffect(() => {
  //   axios.post('http://localhost:3000/api/players/get-patient-list')
  //     .then((response) => {
  //       setPlayers(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching players data:', error);
  //     });
  // }, []);

  // Filtering and Searching Logic
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="patients-page-container">
      <div className="page-header">
        <h1>Patients</h1>
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

      <PatientsTable patients={currentPlayers} />

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

export default PatientsPage;