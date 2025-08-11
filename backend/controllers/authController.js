import User from "../models/User.js";
import Session from "../models/Session.js";
import bcrypt from "bcryptjs";
import { createToken, verifyToken } from "../utils/token.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import nodemailer from "nodemailer";
import ResetPasswordToken from "../models/ResetPasswordToken.js";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error);
  } else {
    console.log("Transporter verified successfully");
  }
});

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "48h";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signupUser = async (req, res) => {
  const { name, email, password, city, country, role } = req.body;

  try {
    if (!name || !email || !password || !city || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
      city,
      country,
      role: role || "user",
    });

    res.status(200).json({
      message: "User created successfully",
      user: {
        name: user.name,
        email: user.email,
        city: user.city,
        country: user.country,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during signup" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = createToken(
    { userId: user._id },
    process.env.JWT_SECRET,
    ACCESS_TOKEN_EXPIRY
  );
  const refreshToken = createToken(
    { userId: user._id },
    process.env.REFRESH_SECRET,
    REFRESH_TOKEN_EXPIRY
  );

  await Session.create({
    userId: user._id,
    jwtToken: accessToken,
    refreshToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    refreshExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 48 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Login successful",
    jwt_token: accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    },
    metadata: {
      user_agent: "RandomBrowser/1.0",
      client_ip: "123.45.67.89",
    },
  });
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const payload = verifyToken(refreshToken, process.env.REFRESH_SECRET);
    const session = await Session.findOne({ refreshToken });

    if (!session || session.userId.toString() !== payload.userId) {
      return res.status(401).json({ message: "Invalid session" });
    }

    if (new Date() > session.refreshExpiresAt) {
      return res.status(401).json({ message: "Refresh token expired" });
    }

    const newAccessToken = createToken(
      { userId: payload.userId },
      process.env.JWT_SECRET,
      ACCESS_TOKEN_EXPIRY
    );

    session.jwtToken = newAccessToken;
    session.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await session.save();

    const user = await User.findById(payload.userId);
    res.json({
      jwt_token: newAccessToken,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user.id,
      },
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    return res.status(200).json({ message: "Logged out" });
  }

  try {
    await Session.deleteOne({ refreshToken });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during logout" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const passwordHash = await bcrypt.hash(randomPassword, 12);

      user = await User.create({
        name,
        email,
        passwordHash,
        city: "Not provided",
        country: "Not provided",
      });

      // Tell frontend: profile is incomplete
      return res.status(201).json({
        message: "New Google user. Please complete profile.",
        profileIncomplete: true,
        user: { id: user.id, name: user.name, email: user.email },
      });
    }

    const accessToken = createToken(
      { userId: user._id },
      process.env.JWT_SECRET,
      ACCESS_TOKEN_EXPIRY
    );

    const refreshToken = createToken(
      { userId: user._id },
      process.env.REFRESH_SECRET,
      REFRESH_TOKEN_EXPIRY
    );

    await Session.create({
      userId: user._id,
      jwtToken: accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      refreshExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 48 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      jwt_token: accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        country: user.country,
        role: user.role,
        created_at: user.created_at,
      },
      metadata: {
        user_agent: "RandomBrowser/1.0",
        client_ip: "123.45.67.89",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

export const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Respond with success even if user not found to avoid email enumeration
      return res
        .status(200)
        .json({ message: "If registered, reset email sent" });
    }

    // Delete any existing tokens for this user
    await ResetPasswordToken.deleteMany({ userId: user._id });

    // Create token and expiry (e.g., 1 hour)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await ResetPasswordToken.create({
      userId: user._id,
      token,
      expiresAt,
    });

    // Construct reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Send mail
    await transporter.sendMail({
      from: `"YourApp Support" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.status(200).json({ message: "If registered, reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPasswordConfirm = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  try {
    const tokenDoc = await ResetPasswordToken.findOne({ token });
    if (!tokenDoc) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (new Date() > tokenDoc.expiresAt) {
      await ResetPasswordToken.deleteOne({ _id: tokenDoc._id });
      return res.status(400).json({ message: "Token expired" });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash new password and save
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    // Remove token so it cannot be reused
    await ResetPasswordToken.deleteOne({ _id: tokenDoc._id });

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
