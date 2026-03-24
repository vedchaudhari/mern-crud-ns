import axios from "axios";

const BASE = "http://localhost:5000/students";

export const getStudents = (page, limit) =>
  axios.get(`${BASE}?page=${page}&limit=${limit}`);

export const createStudent = (data) =>
  axios.post(BASE, data);

export const updateStudent = (id, data) =>
  axios.put(`${BASE}/${id}`, data);

export const deleteStudent = (id) =>
  axios.delete(`${BASE}/${id}`);