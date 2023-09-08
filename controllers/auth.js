import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import users from "../models/Auth.js";

const SECRET = process.env.SECRET || "SECRET";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ message: "User already exist!" });
    }
    const hashedPwd = await bcrypt.hash(password, 12);
    const newUser = await users.create({ name, email, password: hashedPwd });
    // creating token
    const token = jwt.sign({ email: newUser, email, id: newUser._id }, SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ result: newUser, token });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User don't exist" });
    }
    const isPwdCrt = await bcrypt.compare(password, existingUser.password);
    if (!isPwdCrt) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: existingUser, token });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
