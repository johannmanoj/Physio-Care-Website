import React from "react";
import "./PaginationFooter.css";

function PaginationFooter({ page_count, paginate, currentPage, totalPages }) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5; // how many numbers to show around current page

    if (totalPages <= 7) {
      // show all if few pages
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      pageNumbers.push(1); // always show first page

      if (startPage > 2) pageNumbers.push("...");

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages); // always show last page
    }

    return pageNumbers;
  };

  const handlePaginate = (page) => {
    if (page !== "..." && page >= 1 && page <= totalPages && page !== currentPage) {
      paginate(page);
    }
  };

  return (
    <div className="pagination-footer-layout">
      <span className="pagination-footer-info">{page_count}</span>

      <nav className="pagination-footer-nav">
        <ul className="pagination-footer-list">
          {/* Previous Button */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              onClick={() => handlePaginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-link"
            >
              Prev
            </button>
          </li>

          {/* Dynamic Page Numbers */}
          {getPageNumbers().map((num, index) => (
            <li
              key={index}
              className={`page-item ${num === currentPage ? "active" : ""}`}
            >
              <button
                onClick={() => handlePaginate(num)}
                className={`page-number ${num === "..." ? "ellipsis" : ""}`}
                disabled={num === "..."}
              >
                {num}
              </button>
            </li>
          ))}

          {/* Next Button */}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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
