import { useState, useEffect } from "react";
import { createStudent, updateStudent } from "../api/studentApi";
import Swal from "sweetalert2";

const StudentForm = ({ selected, refresh, clear }) => {
  const [form, setForm] = useState({ name: "", email: "", age: "" });

  // Sync form state whenever selected changes
  useEffect(() => {
    if (selected) {
      setForm({ name: selected.name, email: selected.email, age: selected.age });
    } else {
      setForm({ name: "", email: "", age: "" });
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

      clear();
      refresh();
      setForm({ name: "", email: "", age: "" });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || err.message, "error");
    }
  };

  return (
    <form className="container mt-4" onSubmit={handleSubmit}>
      <h4>{selected ? "Edit Student" : "Add Student"}</h4>

      <input
        className="form-control mb-2"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />

      <input
        className="form-control mb-2"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />

      <input
        className="form-control mb-2"
        name="age"
        type="number"
        min="1"
        value={form.age}
        onChange={handleChange}
        placeholder="Age"
        required
      />

      <button className="btn btn-primary" type="submit">
        {selected ? "Update" : "Create"}
      </button>

      {selected && (
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={clear}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default StudentForm;