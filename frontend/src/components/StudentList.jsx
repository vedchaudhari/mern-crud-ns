import { useEffect, useState } from "react";
import { getStudents, deleteStudent } from "../api/studentApi";
import Swal from "sweetalert2";
import Pagination from "./Pagination";

const StudentList = ({ setSelected }) => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  const fetchData = async () => {
    const res = await getStudents(page, limit);
    setStudents(res.data.data);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete?",
      showCancelButton: true
    }).then(async (r) => {
      if (r.isConfirmed) {
        await deleteStudent(id);
        fetchData();
      }
    });
  };

  return (
    <div className="container mt-4">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.age}</td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => setSelected(s)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(s.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        total={total}
        limit={limit}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default StudentList;