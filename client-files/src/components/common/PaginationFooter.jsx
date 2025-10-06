import React from 'react';
import './PaginationFooter.css';

function PaginationFooter({page_count, playersPerPage, totalPlayers, paginate, currentPage, totalPages }) {
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
        <div className='pagination-footer-layout'>
            <span className="pagination-footer-info">
                {page_count}
                {/* Showing {indexOfFirstAppointment + 1} to {Math.min(indexOfLastAppointment, filteredAppointments.length)} of {filteredAppointments.length} */}
            </span>
            <nav className="pagination-footer-nav">
                <ul className="pagination-footer-list">
                    {/* Prev button */}
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            onClick={() => handlePaginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="page-link"
                        >
                            Previous
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
                                className="page-number"
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
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default PaginationFooter;
