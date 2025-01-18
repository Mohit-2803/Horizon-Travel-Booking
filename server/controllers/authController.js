import User from "../models/User.js";
import VerificationCode from "../models/VerificationCode.js"; // Corrected import
import bcrypt from "bcrypt";
import crypto from "crypto";
import createTransporter from "../config/nodemailerConfig.js";
import jwt from "jsonwebtoken";
import path from "path";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists and is verified
    const userExists = await User.findOne({ email });
    if (userExists?.isVerified) {
      return res
        .status(400)
        .json({ message: "User already exists! Kindly login instead" });
    }

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Account already exists. Kindly login" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user instance with isVerified set to false
    const newUser = new User({
      name: username,
      email,
      password: hashedPassword,
      isVerified: false, // User is not verified initially
      role: "user", // Default role set to 'user
    });

    // Save the user to the database
    await newUser.save();

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Check if an OTP record already exists for this email
    const existingOtp = await VerificationCode.findOne({ email });

    if (existingOtp) {
      // Update the existing OTP record with a new code and expiration time
      existingOtp.passcode = otp;
      existingOtp.expiresAt = expiresAt;
      await existingOtp.save();
    } else {
      // Create a new OTP record if none exists
      const newOtp = new VerificationCode({
        email,
        passcode: otp,
        expiresAt,
      });
      await newOtp.save();
    }

    // Send OTP to the user's email
    const transporter = await createTransporter();
    const mailOptions = {
      from: `"Horizon" <${process.env.EMAIL_USER}>`, // Name and email
      to: email,
      subject: "Account Verification OTP - Horizon",
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        // <img src="cid:ticket_booking_logo" alt="Ticket Booking Logo" style="max-width: 50px; margin-right: 10px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #333333;">Horizon Booking</h1>
      </div>
      <h2 style="font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px;">Account Verification OTP</h2>
      <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">Dear Valued Customer,</p>
      <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">You requested an OTP for account verification with Horizon Booking. Please use the following OTP:</p>
      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center; font-size: 24px; color: #333333; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <strong>${otp}</strong>
      </div>
      <p style="font-size: 16px; color: #666666; margin-top: 20px;">This OTP is valid for 10 minutes. Please use it to verify your account.</p>
      <p style="font-size: 16px; color: #666666;">If you did not request this OTP, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <p style="font-size: 14px; color: #999999;">This email was sent by Horizon Booking. Please do not reply to this email.</p>
      </div>
      <p style="font-size: 14px; color: #999999; margin-top: 20px;">Horizon Booking, 123 Main Street, City, Country</p>
    </div>
  `,
      attachments: [
        {
          filename: "logo.svg",
          path: "C:UserspersoProgrammingBooking-Systemassetslogo.svg", // Update with the correct path to the logo file
          cid: "ticket_booking_logo", // This CID will be used in the <img> tag
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending OTP: ", error);
      return res.status(500).json({ message: "Failed to send OTP." });
    }

    return res.status(200).json({
      message:
        "Signup initiated. OTP sent to your email. Please verify the OTP.",
      userId: newUser._id, // Send userId for OTP verification
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during signup." });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body; // Only email and otp sent by client

  try {
    // Check if OTP exists and is valid
    const otpRecord = await VerificationCode.findOne({ email, passcode: otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Find the user by email
    const user = await User.findOne({ email }); // Find the user by email directly
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log(user);
    // Only save the user after OTP verification
    user.isVerified = true;
    await user.save();

    // Delete OTP record as it's used
    await VerificationCode.deleteOne({ email, passcode: otp });

    return res
      .status(200)
      .json({ message: "OTP verified successfully. User is now verified." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during OTP verification." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "User is not verified" });
    }

    // Compare the password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Generate JWT token (1 hour expiry)
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Optionally, send the token in the response or as a cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    }); // 1 hour expiry

    // Check if the user is an admin
    if (user.role === "admin") {
      return res.status(200).json({
        message: "Admin login successful",
        token,
        userId: user._id, // Send userId along with the token
        isAdmin: true,
      });
    }

    // For regular user login
    return res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id, // Send userId along with the token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during login." });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body; // Accept email from the client

  const pathToLogo = path.resolve("../assets/logo.svg");
  console.log("Logo Path: ", pathToLogo);

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "User is already verified. Please log in." });
    }

    // Generate a new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Check if an OTP record already exists for this email
    const existingOtp = await VerificationCode.findOne({ email });

    if (existingOtp) {
      // Update the existing OTP record with a new code and expiration time
      existingOtp.passcode = otp;
      existingOtp.expiresAt = expiresAt;
      await existingOtp.save();
    } else {
      // Create a new OTP record if none exists
      const newOtp = new VerificationCode({
        email,
        passcode: otp,
        expiresAt,
      });
      await newOtp.save();
    }

    // Send OTP to the user's email
    const transporter = await createTransporter();
    const mailOptions = {
      from: `"Horizon Booking" <${process.env.EMAIL_USER}>`, // Name and email
      to: email,
      subject: "Resend OTP for Account Verification - Horizon Booking",
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="cid:ticket_booking_logo" alt="Ticket Booking Logo" style="max-width: 50px; margin-right: 10px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #333333;">Horizon Booking</h1>
      </div>
      <h2 style="font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px;">Account Verification OTP</h2>
      <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">Dear Valued Customer,</p>
      <p style="font-size: 16px; color: #666666; margin-bottom: 20px;">You requested a new OTP for account verification with Horizon Booking. Please use the following OTP:</p>
      <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; text-align: center; font-size: 24px; color: #333333; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <strong>${otp}</strong>
      </div>
      <p style="font-size: 16px; color: #666666; margin-top: 20px;">This OTP is valid for the next 10 minutes. Please enter it on the website to verify your account.</p>
      <p style="font-size: 16px; color: #666666;">If you did not request this OTP, please disregard this message.</p>
      <hr style="border: none; border-top: 1px solid #dddddd; margin: 20px 0;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <p style="font-size: 14px; color: #999999;">This email was sent by Horizon Booking. Please do not reply to this email.</p>
      </div>
      <p style="font-size: 14px; color: #999999; margin-top: 20px;">Horizon Booking, 123 Main Street, City, Country</p>
    </div>
  `,
      attachments: [
        {
          filename: "logo.svg",
          path: "./assets/logo.svg",
          cid: "ticket_booking_logo", // CID should match the reference in the HTML
          encoding: "base64", // Optional: ensure encoding is set properly
          contentType: "image/svg+xml", // Set appropriate content type for SVG image
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP: ", error);
        return res.status(500).json({ message: "Failed to send OTP." });
      }
      console.log("OTP resent: ", info.response);
    });

    return res.status(200).json({
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error resending OTP." });
  }
};

// Controller to get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL params

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
