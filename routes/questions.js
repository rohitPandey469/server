import express from "express";

import {
  askQuestion,
  getAllQuestions,
  deleteQuestion,
  voteQuestion,
} from "../controllers/questions.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/ask", auth, askQuestion);
router.get("/get", getAllQuestions);
router.delete("/delete/:id", auth, deleteQuestion);
router.patch("/vote/:id", voteQuestion);

export default router;
