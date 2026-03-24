import { useEffect, useState } from "react";
import { getStudents, deleteStudent, getStudentById, addStudentMarks, updateStudent, updateMark, deleteMark } from "../api/studentApi";
import Swal from "sweetalert2";


const StudentList = ({ onAddNew, triggerRefresh }) => {
  const [students, setStudents] = useState([]);
  
  // Read initial state from URL
  const queryParams = new URLSearchParams(window.location.search);
  const initialPage = parseInt(queryParams.get("page")) || 1;
  const initialSearch = queryParams.get("search") || "";

  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(initialSearch);
  const limit = 4;

  const [marksModal, setMarksModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", age: "" });
  const [newMark, setNewMark] = useState({ subject: "", score: "" });

  const [editMarkId, setEditMarkId] = useState(null);
  const [editMarkData, setEditMarkData] = useState({ subject: "", score: "" });


  const fetchData = async (targetPage = page) => {
    try {
      const res = await getStudents(targetPage, limit, search);
      setStudents(res.data.data);
      setTotal(res.data.total);
      if (targetPage !== page) setPage(targetPage);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (page > 1) params.set("page", page); else params.delete("page");
    if (search) params.set("search", search); else params.delete("search");
    
    const newRelativePathQuery = window.location.pathname + (params.toString() ? "?" + params.toString() : "");
    window.history.replaceState(null, "", newRelativePathQuery);
  }, [page, search]);

  useEffect(() => {
    const debounce = setTimeout(() => {
        fetchData();
    }, 300);
    return () => clearTimeout(debounce);
  }, [page, search]);

  useEffect(() => {
    if (triggerRefresh && triggerRefresh.timestamp > 0) {
      handleRefresh(triggerRefresh.isNew);
    }
  }, [triggerRefresh]);

  const handleRefresh = (isNew = false) => {
    if (isNew) {
      const nextTotal = total + 1;
      const lastPage = Math.ceil(nextTotal / limit);
      fetchData(lastPage || 1);
    } else {
      fetchData();
    }
  };

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
      setEditMarkId(null); // Reset mark edit state
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

  const handleEditClick = (student) => {
    setCurrentStudent(student);
    setEditData({ name: student.name, email: student.email, age: student.age });
    setEditModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(currentStudent.id, editData);
      setEditModal(false);
      fetchData();
      Swal.fire({
        title: "Updated!",
        text: "Member updated successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire("Error", "Could not update member", "error");
    }
  };

  const handleDeleteMark = (markId) => {
    Swal.fire({
      title: "Delete Mark?",
      text: "This mark will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete"
    }).then(async (rc) => {
      if (rc.isConfirmed) {
        try {
          await deleteMark(markId);
          const res = await getStudentById(currentStudent.id);
          setCurrentStudent(res.data);
          Swal.fire("Deleted!", "Mark removed", "success");
        } catch (err) {
          Swal.fire("Error", "Could not delete mark", "error");
        }
      }
    });
  };

  const startEditMark = (mark) => {
    setEditMarkId(mark.id);
    setEditMarkData({ subject: mark.subject, score: mark.score });
  };

  const handleUpdateMark = async (markId) => {
    try {
      await updateMark(markId, editMarkData);
      const res = await getStudentById(currentStudent.id);
      setCurrentStudent(res.data);
      setEditMarkId(null);
      Swal.fire({
        title: "Updated!",
        text: "Mark updated successfully",
        icon: "success",
        timer: 1000,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire("Error", "Could not update mark", "error");
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
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.age}</td>
              <td>
                <button className="btn-small-marks" onClick={() => handleShowMarks(s)}>
                  <i className="bi bi-journal-check"></i> Marks
                </button>
              </td>
              <td>
                <i className="bi bi-pencil-square action-icon me-2" style={{color: '#0d6efd', cursor: 'pointer'}} onClick={() => handleEditClick(s)}></i>
                <i className="bi bi-trash-fill action-icon" style={{color: '#dc3545', cursor: 'pointer'}} onClick={() => handleDelete(s.id)}></i>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="6" style={{textAlign: "center"}}>No members found</td>
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

      {editModal && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal" style={{width: '500px'}}>
            <div className="custom-modal-header">
              <h4 className="custom-modal-title">Edit Member</h4>
              <button type="button" className="custom-modal-close" onClick={() => setEditModal(false)}>&times;</button>
            </div>
            <div className="custom-modal-body">
              <form onSubmit={handleUpdateStudent}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input 
                    className="form-control-custom" 
                    value={editData.name} 
                    onChange={(e) => setEditData({...editData, name: e.target.value})} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email"
                    className="form-control-custom" 
                    value={editData.email} 
                    onChange={(e) => setEditData({...editData, email: e.target.value})} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input 
                    type="number"
                    className="form-control-custom" 
                    value={editData.age} 
                    onChange={(e) => setEditData({...editData, age: e.target.value})} 
                    required
                  />
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
                  <button type="button" className="btn-secondary" onClick={() => setEditModal(false)} style={{padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff'}}>Cancel</button>
                  <button type="submit" className="btn-add-member" style={{padding: '8px 16px', margin: 0}}>Update Member</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudent.marks?.map((m) => (
                      <tr key={m.id}>
                        <td>
                          {editMarkId === m.id ? (
                            <input 
                              className="form-control-custom" 
                              style={{padding: '5px'}}
                              value={editMarkData.subject} 
                              onChange={(e) => setEditMarkData({...editMarkData, subject: e.target.value})}
                            />
                          ) : m.subject}
                        </td>
                        <td>
                          {editMarkId === m.id ? (
                            <input 
                              type="number"
                              className="form-control-custom" 
                              style={{padding: '5px'}}
                              value={editMarkData.score} 
                              onChange={(e) => setEditMarkData({...editMarkData, score: e.target.value})}
                            />
                          ) : m.score}
                        </td>
                        <td>
                          {editMarkId === m.id ? (
                            <>
                              <i className="bi bi-check-circle-fill" style={{color: '#198754', cursor: 'pointer', fontSize: '1.2rem', marginRight: '10px'}} onClick={() => handleUpdateMark(m.id)}></i>
                              <i className="bi bi-x-circle-fill" style={{color: '#dc3545', cursor: 'pointer', fontSize: '1.2rem'}} onClick={() => setEditMarkId(null)}></i>
                            </>
                          ) : (
                            <>
                              <i className="bi bi-pencil-fill" style={{color: '#0d6efd', cursor: 'pointer', marginRight: '10px'}} onClick={() => startEditMark(m)}></i>
                              <i className="bi bi-trash-fill" style={{color: '#dc3545', cursor: 'pointer'}} onClick={() => handleDeleteMark(m.id)}></i>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(!currentStudent.marks || currentStudent.marks.length === 0) && (
                      <tr>
                        <td colSpan="3" style={{textAlign: 'center'}}>No marks recorded</td>
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