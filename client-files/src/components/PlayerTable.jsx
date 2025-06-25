import React from 'react';
import './PlayerTable.css'; // For table specific styles

function PlayerTable({ players }) {
  return (
    <div className="table-wrapper">
      <table className="player-table">
        <thead>
          <tr>
            <th>Profile Image</th>
            <th>Full Names</th>
            <th>Surname</th>
            <th>Team(s)</th>
            <th>Active</th>
            <th>Has PDP(s)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.id}>
              <td>
                <img
                  src={player.profileImage}
                  alt={player.fullName}
                  className="profile-thumbnail"
                />
              </td>
              <td>{player.fullName}</td>
              <td>{player.surname}</td>
              <td>{player.teams.join(', ')}</td>
              <td>{player.active ? '✅' : '❌'}</td>
              <td>{player.hasPdp ? '✅' : '❌'}</td>
              <td>
                <button className="view-button">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerTable;