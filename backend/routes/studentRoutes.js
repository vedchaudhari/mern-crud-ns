import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  addMarks,
  updateMark,
  deleteMark,
} from "../controllers/studentController.js";


const router = express.Router();

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.patch("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.post("/:id/marks", addMarks);
router.patch("/marks/:id", updateMark);
router.delete("/marks/:id", deleteMark);

export default router;
