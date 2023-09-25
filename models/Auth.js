import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET || "SECRET";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  score1: {
    //for questions
    type: Number,
    default: 0,
  },
  score2: {
    //for answers
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
  badge: {
    type: String,
    enum: ["Newbie", "Pro", "Expert", "Master", "God"],
    default: "Newbie",
  },
  answersGiven: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  tags: {
    type: [String],
  },
  joinedOn: {
    type: Date,
    default: Date.now,
  },
});

// pre hook - hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// method - generate Auth Token
userSchema.methods.generateAuthToken = async function () {
  // "this" refers to the specific User model object
  try {
    let newtoken = jwt.sign({ email: this.email, id: this._id }, SECRET, {
      expiresIn: "1h",
    });

    // mulitple token addition
    // this.tokens = this.tokens.concat({ token: newtoken });
    // await this.save();
    return newtoken;
  } catch (error) {
    res.status(400).json(error);
  }
};

export default mongoose.model("User", userSchema);
