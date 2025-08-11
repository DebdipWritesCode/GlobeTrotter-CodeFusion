import User from "../models/User.js";
import Session from "../models/Session.js";
import bcrypt from "bcryptjs";
import { createToken, verifyToken } from "../utils/token.js";
import { OAuth2Client } from "google-auth-library";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "48h";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    res.status(200).json({
      message: "User created successfully",
      user: { name: user.name, email: user.email },
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
      user: { name: user.name, email: user.email },
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
