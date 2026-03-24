const Pagination = ({ total, limit, page, setPage }) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="text-center">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="btn btn-secondary me-2"
      >
        Prev
      </button>

      {page} / {totalPages}

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="btn btn-secondary ms-2"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;