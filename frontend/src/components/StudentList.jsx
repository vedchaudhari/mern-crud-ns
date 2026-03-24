import { useEffect, useState } from "react";
import { getStudents, deleteStudent, getStudentById, addStudentMarks } from "../api/studentApi";
import Swal from "sweetalert2";


const StudentList = ({ onEdit, onAddNew }) => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 10;

  const [marksModal, setMarksModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [newMark, setNewMark] = useState({ subject: "", score: "" });


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

  const handleShowMarks = async (student) => {
    try {
      const res = await getStudentById(student.id);
      setCurrentStudent(res.data);
      setMarksModal(true);
    } catch (err) {
      Swal.fire("Error", "Could not fetch marks", "error");
    }
  };

  const handleAddMark = async (e) => {
    e.preventDefault();
    if (!newMark.subject || !newMark.score) return;
    try {
      await addStudentMarks(currentStudent.id, newMark);
      const res = await getStudentById(currentStudent.id);
      setCurrentStudent(res.data);
      setNewMark({ subject: "", score: "" });
      Swal.fire({
        title: "Added!",
        text: "Marks added successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire("Error", "Could not add marks", "error");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="toolbar">
        <div className="search-container">
          <i className="bi bi-search search-icon"></i>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search members..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
          />
        </div>
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
            <th>Marks</th>
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
                <button className="btn-small-marks" onClick={() => handleShowMarks(s)}>
                  <i className="bi bi-journal-check"></i> Marks
                </button>
              </td>
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

      {marksModal && currentStudent && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal" style={{width: '600px'}}>
            <div className="custom-modal-header">
              <h4 className="custom-modal-title">Marks for {currentStudent.name}</h4>
              <button type="button" className="custom-modal-close" onClick={() => setMarksModal(false)}>&times;</button>
            </div>
            <div className="custom-modal-body">
              <div className="marks-list">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudent.marks?.map((m, idx) => (
                      <tr key={idx}>
                        <td>{m.subject}</td>
                        <td>{m.score}</td>
                      </tr>
                    ))}
                    {(!currentStudent.marks || currentStudent.marks.length === 0) && (
                      <tr>
                        <td colSpan="2" style={{textAlign: 'center'}}>No marks recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <hr />
              <form onSubmit={handleAddMark} className="marks-add-form">
                <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end'}}>
                  <div className="form-group" style={{flex: 1, marginBottom: 0}}>
                    <label className="form-label">Subject</label>
                    <input 
                      className="form-control-custom" 
                      placeholder="Subject" 
                      value={newMark.subject} 
                      onChange={(e) => setNewMark({...newMark, subject: e.target.value})} 
                      required
                    />
                  </div>
                  <div className="form-group" style={{flex: 1, marginBottom: 0}}>
                    <label className="form-label">Score</label>
                    <input 
                      type="number"
                      className="form-control-custom" 
                      placeholder="Score" 
                      value={newMark.score} 
                      onChange={(e) => setNewMark({...newMark, score: e.target.value})} 
                      required
                    />
                  </div>
                  <button type="submit" className="btn-add-member" style={{padding: '10px 20px'}}>Add</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentList;