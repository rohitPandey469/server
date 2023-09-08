import questions from "../models/Questions.js";
import mongoose from "mongoose";

export const askQuestion = async (req, res) => {
  const postQuestionData = req.body;
  const postQuestion = new questions(postQuestionData);
  try {
    await postQuestion.save();
    res.status(200).json({ message: "Posted a question successfully" });
  } catch (err) {
    res.status(409).json({ message: "Couldn't post the question" });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const questionList = await questions.find();
    res.status(200).json(questionList);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send({ message: "Question unvalid" });
    }
    // questions delete karne pe
    //  answers apne aap delete hogaya
    // questions ke andar hi answer array present tha
    await questions.findByIdAndDelete(_id);
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const voteQuestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send({ message: "Question unvalid" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(404).send({ message: "Question unvalid" });
  }
  try {
    const question = await questions.findById(_id);
    const upIndex = question.upVote.findIndex((id) => id === String(userId)); // finding the index of the userId in the array
    const downIndex = question.downVote.findIndex(
      (id) => id === String(userId)
    ); // finding the index of the userId in the array

    if (value === "upVote") {
      if (downIndex !== -1) {
        // userID present in downIndex
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
      if (upIndex === -1) {
        // userId not present in upIndex
        question.upVote.push(userId);
      } else {
        // userId present in upIndex
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
    } else {
      if (upIndex !== -1) {
        // userID present in upIndex
        question.upVote = question.upVote.filter((id) => id !== String(userId));
      }
      if (downIndex === -1) {
        // userId not present in downIndex
        question.downVote.push(userId);
      } else {
        // userId present in downIndex
        question.downVote = question.downVote.filter(
          (id) => id !== String(userId)
        );
      }
    }
    // updating the question in the database
    await questions.findByIdAndUpdate(_id, question);
    res.status(200).json({ message: "voted successfully" });
  } catch (err) {
    res.status(404).josn({ message: "id not found" });
  }
};
