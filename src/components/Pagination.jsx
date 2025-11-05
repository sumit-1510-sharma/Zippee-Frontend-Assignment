export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="flex justify-center mt-8 gap-4 items-center">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-800 rounded-lg text-yellow-300 hover:bg-gray-700 disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-gray-300">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
        className="px-4 py-2 bg-gray-800 rounded-lg text-yellow-300 hover:bg-gray-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
