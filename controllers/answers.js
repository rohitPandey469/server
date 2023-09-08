import mongoose from "mongoose";
import questions from "../models/Questions.js";

export const postAnswer = async (req, res) => {
  const { id: _id } = req.params;
  const { noOfAnswers, answerBody, userAnswered, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send({ message: "Question unvalid" });
  }

  updatedQuestion(_id, noOfAnswers);
  try {
    const updatedQuestion = await questions.findByIdAndUpdate(_id, {
      $addToSet: { answer: [{ answerBody, userAnswered, userId }] }, //append
    });
    res.status(200).json(updatedQuestion);
  } catch (err) {
    res.status(400).json(err);
  }
};

const updatedQuestion = async (_id, noOfAnswers) => {
  try {
    await questions.findByIdAndUpdate(_id, {
      $set: { noOfAnswers: noOfAnswers }, //changed
    });
  } catch (err) {
    console.log(err);
  }
};

export const deleteAnswer = async (req, res) => {
  const { id: _id } = req.params;
  const { answerId, noOfAnswers } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send({ message: "Question unvalid" });
  }
  if (!mongoose.Types.ObjectId.isValid(answerId)) {
    return res.status(404).send({ message: "Question unvalid" });
  }
  updatedQuestion(_id, noOfAnswers);
  try {
    await questions.updateOne(
      { _id },
      { $pull: { answer: { _id: answerId } } } // pull out one answer from answer array
    );
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    res.status(405).json(err);
  }
};
