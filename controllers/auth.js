import User from "../models/Auth.js";
import UserOtp from "../models/UserOtp.js";
import nodemailer from "nodemailer";
import "dotenv/config";

const SECRET = process.env.SECRET || "SECRET";

// email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  // secure:true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

////////////////////Register////////////////////////////
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  try {
    const duplicate = await User.findOne({ email: email });

    if (duplicate) {
      return res.status(409).json({ email: "Already registered email" });
    } else {
      const result = await User.create({
        name,
        email,
        password,
      });

      //   just before save - prehook runs and update pwd

      // TOKEN GENERATE - methods pesent in User Schema
      const token = await result.generateAuthToken();

      return res.status(200).json({ result: result, token: token });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

/////////////////////Otp///////////////////////////
export const userSendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Please Enter Your Email" });
  }

  try {
    const presuer = await User.findOne({ email: email });

    if (presuer) {
      const OTP = Math.floor(100000 + Math.random() * 900000);

      // if email already present in UserOtp collections
      // just update the otp
      // no need to create a new UserOtp object
      // cause two emails will then be present in the above mentioned collections
      const existEmail = await UserOtp.findOne({ email: email });

      // console.log("Exist email in userSendOtp function - backend", existEmail);
      if (existEmail) {
        const updateData = await UserOtp.findByIdAndUpdate(
          { _id: existEmail._id },
          {
            otp: OTP,
          },
          { new: true }
        );
        await updateData.save();

        // sending mail to already present user in UserOtp collection
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Sending Eamil For Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error", error);
            res.status(400).json({ message: "Email not sent - try again" });
          } else {
            console.log("Email sent", info.response);
            res.status(200).json({ message: "Email sent Successfully" });
          }
        });
      } else {
        await UserOtp.create({
          email,
          otp: OTP,
        });

        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Sending Eamil For Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error", error);
            res.status(400).json({ message: "Email not send" });
          } else {
            console.log("Email sent", info.response);
            res.status(200).json({ message: "Email sent Successfully" });
          }
        });
      }
    } else {
      res.status(400).json({ message: "Email not registered" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

/////////////////////Login//////////////////////////
export const login = async (req, res) => {
  const { email, otp } = req.body;

  // console.log(email, otp);

  if (!otp || !email) {
    return res.status(400).json({ message: "Please enter your otp and email" });
  }
  try {
    const otpverfication = await UserOtp.findOne({ email: email });
    if (!otpverfication) {
      return res.status(400).json({ message: "Email not registered" });
    }

    if (otpverfication.otp === otp) {
      // User Logged In
      const foundUser = await User.findOne({ email: email });

      // TOKEN GENERATE - methods pesent in User Schema
      const token = await foundUser.generateAuthToken();

      return res.status(200).json({ result: foundUser, token: token });
    } else {
      return res.status(400).json({ message: "Invalid Otp" });
    }
  } catch (error) {
    console.error(error.response);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  {
  }
};
