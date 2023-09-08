import 'dotenv/config'
import mongoose from "mongoose";

const DB_URL =
  process.env.DATABASE_URI 
  // || "mongodb://127.0.0.1:27017/stack-overflow";
const dbConn = () => {
  mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default dbConn;
