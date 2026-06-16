import {
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";


function SupportPagination({
  page,
  totalPages,
  onPrev,
  onNext,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="support-paging-container">

      <div className="support-paging-info">
        Page {page} of {totalPages}
      </div>

      <div className="support-paging-actions">

        <button
          onClick={onPrev}
          disabled={page === 1}
          className="support-page-control"
        >
          <FaChevronLeft />
          Previous
        </button>

        <div className="support-page-current">
          {page}
        </div>

        <button
          onClick={onNext}
          disabled={page === totalPages}
          className="support-page-control"
        >
          Next
          <FaChevronRight />
        </button>

      </div>

    </div>
  );
}

export default SupportPagination;