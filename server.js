import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dbConn from "./config/dbConn.js";
import userRoutes from "./routes/users.js";
import questionsRoutes from "./routes/questions.js";
import answerRoutes from "./routes/answers.js";
import stripeRoute from "./routes/stripe.js";
import dialogflowRoute from "./routes/dialogflow.js";
import corsOptions from "./config/corsOptions.js";

const PORT = process.env.PORT || 5000;

const app = express();
dbConn();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// routes
app.use("/user", userRoutes);
app.use("/questions", questionsRoutes);
app.use("/answers", answerRoutes);
app.use("/api/dialogflow", dialogflowRoute);
app.use("/api/create-checkout-session", stripeRoute);

app.get("/", (req, res) => {
  res.send("This is stack overflow rest api");
});

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
