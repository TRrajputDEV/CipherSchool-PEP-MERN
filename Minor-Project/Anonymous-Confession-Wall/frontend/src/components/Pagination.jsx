const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const showMax = 7; // Max page buttons to show

  if (totalPages <= showMax) {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Smart pagination with ellipsis
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 py-12">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          flex items-center gap-1 text-xs text-[#8a8784] border border-[#242424]
          px-3 py-2 rounded-lg transition-all
          hover:border-[#363636] hover:text-[#eeebe6]
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#242424] disabled:hover:text-[#8a8784]
        "
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="text-[#5c5a58] px-2">
            •••
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              text-xs px-3 py-2 rounded-lg transition-all
              ${
                page === currentPage
                  ? "bg-[#ff3c3c] text-white border border-[#ff3c3c]"
                  : "text-[#8a8784] border border-[#242424] hover:border-[#363636] hover:text-[#eeebe6]"
              }
            `}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          flex items-center gap-1 text-xs text-[#8a8784] border border-[#242424]
          px-3 py-2 rounded-lg transition-all
          hover:border-[#363636] hover:text-[#eeebe6]
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#242424] disabled:hover:text-[#8a8784]
        "
      >
        Next
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </div>
  );
};

export default Pagination;