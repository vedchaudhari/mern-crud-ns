import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/students";

export const getStudents = (page, limit, search = "") =>
  axios.get(`${BASE}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

export const getStudentById = (id) =>
  axios.get(`${BASE}/${id}`);


export const createStudent = (data) =>
  axios.post(BASE, data);

export const updateStudent = (id, data) =>
  axios.patch(`${BASE}/${id}`, data);

export const deleteStudent = (id) =>
  axios.delete(`${BASE}/${id}`);

export const addStudentMarks = (id, data) =>
  axios.post(`${BASE}/${id}/marks`, data);

export const updateMark = (id, data) =>
  axios.patch(`${BASE}/marks/${id}`, data);

export const deleteMark = (id) =>
  axios.delete(`${BASE}/marks/${id}`);