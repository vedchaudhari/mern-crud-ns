import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/students";

export const getStudents = (page, limit, search = "") =>
  axios.get(`${BASE}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

export const createStudent = (data) =>
  axios.post(BASE, data);

export const updateStudent = (id, data) =>
  axios.put(`${BASE}/${id}`, data);

export const deleteStudent = (id) =>
  axios.delete(`${BASE}/${id}`);