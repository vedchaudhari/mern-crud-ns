import { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "../api/studentApi";
import Swal from "sweetalert2";

const StudentList = ({ onEdit, onAddNew }) => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 10;

  const fetchData = async () => {
    try {
      const res = await getStudents(page, limit, search);
      setStudents(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
        fetchData();
    }, 300);
    return () => clearTimeout(debounce);
  }, [page, search]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "If You delete this Member Then this action can not be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (r) => {
      if (r.isConfirmed) {
        await deleteStudent(id);
        fetchData();
      }
    });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="toolbar">
        <input 
          type="text" 
          className="search-input" 
          placeholder="QA" 
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
        />
        <button className="btn-add-member" onClick={onAddNew}>
          Add New Member
        </button>
      </div>

      <table className="dataTable">
        <thead>
          <tr>
            <th>Id</th>
            <th>Member Name</th>
            <th>member Email</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td style={{cursor: 'pointer'}} onClick={() => onEdit(s)}>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.age}</td>
              <td>
                <i className="bi bi-trash-fill action-icon" onClick={() => handleDelete(s.id)}></i>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="5" style={{textAlign: "center"}}>No members found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="footer-controls">
        <div>Show {limit} entries</div>
        <div className="pagination-controls">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>First</button>
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <button className="page-btn active">{page}</button>
          <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
          <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(totalPages || 1)}>Last</button>
        </div>
      </div>
    </>
  );
};

export default StudentList;