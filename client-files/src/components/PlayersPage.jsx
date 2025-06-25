import React, { useState, useEffect } from 'react';
import PlayerTable from '../components/PlayerTable';
import Pagination from '../components/Pagination';
import './PlayersPage.css';

// Mock Data (replace with API call)
const allPlayers = [
  {
    id: 1,
    profileImage: 'https://placehold.co/40x40/CC5500/ffffff?text=VK',
    fullName: 'Virat Kohli',
    surname: 'Kohli',
    teams: ['Royal Challengers Bangalore'],
    active: true,
    hasPdp: true,
  },
  {
    id: 2,
    profileImage: 'https://placehold.co/40x40/045093/ffffff?text=RS',
    fullName: 'Rohit',
    surname: 'Sharma',
    teams: ['Mumbai Indians'],
    active: true,
    hasPdp: false,
  },
  {
    id: 3,
    profileImage: 'https://placehold.co/40x40/FEDD00/ffffff?text=MD',
    fullName: 'MS Dhoni',
    surname: 'Dhoni',
    teams: ['Chennai Super Kings'],
    active: true,
    hasPdp: true,
  },
  {
    id: 4,
    profileImage: 'https://placehold.co/40x40/FEDD00/ffffff?text=RG',
    fullName: 'Ruturaj',
    surname: 'Gaikwad',
    teams: ['Chennai Super Kings'],
    active: true,
    hasPdp: false,
  },
  {
    id: 5,
    profileImage: 'https://placehold.co/40x40/1C2C5B/ffffff?text=SG',
    fullName: 'Shubman',
    surname: 'Gill',
    teams: ['Gujarat Titans'],
    active: true,
    hasPdp: true,
  },
  {
    id: 6,
    profileImage: 'https://placehold.co/40x40/045093/ffffff?text=HP',
    fullName: 'Hardik',
    surname: 'Pandya',
    teams: ['Mumbai Indians'],
    active: true,
    hasPdp: false,
  },
  {
    id: 7,
    profileImage: 'https://placehold.co/40x40/1C2C5B/ffffff?text=RK',
    fullName: 'Rashid',
    surname: 'Khan',
    teams: ['Gujarat Titans'],
    active: true,
    hasPdp: false,
  },
  {
    id: 8,
    profileImage: 'https://placehold.co/40x40/EA1A7F/ffffff?text=SS',
    fullName: 'Sanju',
    surname: 'Samson',
    teams: ['Rajasthan Royals'],
    active: true,
    hasPdp: false,
  },
  {
    id: 9,
    profileImage: 'https://placehold.co/40x40/EA1A7F/ffffff?text=JB',
    fullName: 'Jos',
    surname: 'Buttler',
    teams: ['Rajasthan Royals'],
    active: true,
    hasPdp: false,
  },
  {
    id: 10,
    profileImage: 'https://placehold.co/40x40/17449B/ffffff?text=DW',
    fullName: 'David',
    surname: 'Warner',
    teams: ['Delhi Capitals'],
    active: true,
    hasPdp: false,
  },
  // ... more mock players to reach 25
  {
    id: 11,
    profileImage: 'https://placehold.co/40x40/17449B/ffffff?text=PS',
    fullName: 'Prithvi',
    surname: 'Shaw',
    teams: ['Delhi Capitals'],
    active: true,
    hasPdp: false,
  },
  {
    id: 12,
    profileImage: 'https://placehold.co/40x40/3B215D/ffffff?text=AR',
    fullName: 'Andre',
    surname: 'Russell',
    teams: ['Kolkata Knight Riders'],
    active: true,
    hasPdp: true,
  },
  {
    id: 13,
    profileImage: 'https://placehold.co/40x40/3B215D/ffffff?text=SN',
    fullName: 'Sunil',
    surname: 'Narine',
    teams: ['Kolkata Knight Riders'],
    active: true,
    hasPdp: false,
  },
  {
    id: 14,
    profileImage: 'https://placehold.co/40x40/CC5500/ffffff?text=FD',
    fullName: 'Faf ',
    surname: 'du Plessis',
    teams: ['Royal Challengers Bangalore'],
    active: true,
    hasPdp: true,
  },
  {
    id: 15,
    profileImage: 'https://placehold.co/40x40/CC5500/ffffff?text=GM',
    fullName: 'Glenn',
    surname: 'Maxwell',
    teams: ['Royal Challengers Bangalore'],
    active: true,
    hasPdp: false,
  }
];


function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(10); // As seen in the image "Showing 1 to 10 of 25"

  const teams = [
    'Royal Challengers Bangalore', 'Mumbai Indians', 'Chennai Super Kings',
    'Gujarat Titans', 'Lucknow Super Giants', 'Rajasthan Royals',
    'Delhi Capitals', 'Kolkata Knight Riders'
  ];

  useEffect(() => {
    // In a real app, you'd fetch data here:
    // fetch('/api/players')
    //   .then(response => response.json())
    //   .then(data => setPlayers(data));

    // For now, use mock data
    setPlayers(allPlayers);
  }, []);

  // Filtering and Searching Logic
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          player.surname.toLowerCase().includes(searchTerm.toLowerCase());
    // Add logic for country and team filters if you have that data in your player objects
    
    const matchesTeam = filterTeam ? player.teams.includes(filterTeam) : true; // Assuming teams is an array

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
        <h1>Players / Index</h1>
        <div className="filters">
          
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
          >
          <option value="">Filter by Team</option>
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
          {/* <button className="search-button">🔍</button> */}
        </div>
        </div>
      </div>

     

      <PlayerTable players={currentPlayers} />

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

export default PlayersPage;