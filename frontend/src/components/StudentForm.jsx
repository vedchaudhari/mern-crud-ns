import { useState, useEffect } from "react";
import { createStudent, updateStudent } from "../api/studentApi";
import Swal from "sweetalert2";

const StudentForm = ({ selected, refresh, onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", age: "", parentId: "" });

  useEffect(() => {
    if (selected) {
      setForm({ name: selected.name, email: selected.email, age: selected.age, parentId: "" });
    } else {
      setForm({ name: "", email: "", age: "", parentId: "" });
    }
  }, [selected]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selected) {
        await updateStudent(selected.id, form);
        Swal.fire("Updated!", "", "success");
      } else {
        await createStudent(form);
        Swal.fire("Created!", "", "success");
      }
      refresh();
      onClose();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || err.message, "error");
    }
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h4 className="custom-modal-title">{selected ? "Edit Member" : "Add New Member"}</h4>
          <button type="button" className="custom-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="custom-modal-body">
          <form id="memberForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Member Name<span className="text-danger">*</span></label>
              <input className="form-control-custom" name="name" value={form.name} onChange={handleChange} placeholder="Enter Member Name" required />
            </div>
            <div className="form-group">
              <label className="form-label">Member Email<span className="text-danger">*</span></label>
              <input className="form-control-custom" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter Member Email" required />
            </div>
            <div className="form-group">
              <label className="form-label">Member Age<span className="text-danger">*</span></label>
              <input className="form-control-custom" name="age" type="number" min="1" value={form.age} onChange={handleChange} placeholder="Enter Age" required />
            </div>
            <div className="form-group">
              <label className="form-label">Member Parent Id</label>
              <input className="form-control-custom" name="parentId" value={form.parentId} onChange={handleChange} placeholder="Enter Parent Id" />
            </div>
          </form>
        </div>
        <div className="custom-modal-footer">
          <button type="submit" form="memberForm" className="btn-submit-modal">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;