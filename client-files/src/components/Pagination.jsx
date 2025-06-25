// src/components/Pagination.js
import React from 'react';
import './Pagination.css'; // For pagination specific styles

function Pagination({ playersPerPage, totalPlayers, paginate, currentPage, totalPages }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-nav">
      <ul className="pagination-list">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a onClick={() => paginate(currentPage - 1)} href="#!" className="page-link">
            &lt;
          </a>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <a onClick={() => paginate(currentPage + 1)} href="#!" className="page-link">
            &gt;
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;