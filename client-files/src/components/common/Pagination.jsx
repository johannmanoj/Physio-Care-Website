import React from 'react';
import './Pagination.css';

function Pagination({ playersPerPage, totalPlayers, paginate, currentPage, totalPages }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePaginate = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      paginate(page);
    }
  };

  return (
    <nav className="pagination-nav">
      <ul className="pagination-list">
        {/* Prev button */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            onClick={() => handlePaginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-link"
          >
            &lt;
          </button>
        </li>

        {/* Page numbers */}
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? 'active' : ''}`}
          >
            <button
              onClick={() => handlePaginate(number)}
              disabled={currentPage === number}
              className="page-link"
            >
              {number}
            </button>
          </li>
        ))}

        {/* Next button */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            onClick={() => handlePaginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-link"
          >
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
