// controllers/studentController.js
import pool from "../config/db.js";

export const createStudent = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    const result = await pool.query(
      "INSERT INTO students (name,email,age) VALUES ($1,$2,$3) RETURNING *",
      [name, email, age]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const searchStr = `%${search}%`;

    const total = await pool.query(
      "SELECT COUNT(*) FROM students WHERE name ILIKE $1 OR email ILIKE $1",
      [searchStr]
    );

    const data = await pool.query(
      "SELECT * FROM students WHERE name ILIKE $1 OR email ILIKE $1 ORDER BY id LIMIT $2 OFFSET $3",
      [searchStr, limit, offset]
    );

    res.json({
      total: parseInt(total.rows[0].count),
      page,
      limit,
      data: data.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await pool.query(
      "SELECT * FROM students WHERE id=$1",
      [id]
    );

    if (!student.rows[0]) {
      return res.status(404).json({ error: "Student not found" });
    }

    const marks = await pool.query(
      "SELECT * FROM marks WHERE student_id=$1",
      [id]
    );

    res.json({ ...student.rows[0], marks: marks.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const result = await pool.query(
      "UPDATE students SET name=$1,email=$2,age=$3 WHERE id=$4 RETURNING *",
      [name, email, age, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM students WHERE id=$1 RETURNING id",
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, score } = req.body;

    const result = await pool.query(
      "INSERT INTO marks (student_id, subject, score) VALUES ($1, $2, $3) RETURNING *",
      [id, subject, score]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};