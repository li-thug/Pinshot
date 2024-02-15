import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import crypto from "crypto";
import { isValidObjectId } from "mongoose";
import generateToken from "../config/generateToken.js";
import Token from "../models/token.model.js";
import env from "../utlis/validateEnv.js";
import sendEmail from "../config/sendMail.js";

const createToken = async (userId, token) => {
  const createToken = new Token(userId, token);
  return createToken.save();
};

const verifyToken = async (userId, token) => {
  return await Token.findOne(userId, token);
};

export const signUp = async (req, res, next) => {
  const { userName, email, password } = req.body;
  try {
    if (!userName || !email || !password) {
      return next(createHttpError(400, "Form fields missing"));
    }
    const currentUserName = await User.findOne({ userName });
    if (currentUserName) {
      return next(
        createHttpError(409, "Username already exist, choose another")
      );
    }
    const currentEmail = await User.findOne({ email });
    if (currentEmail) {
      return next(createHttpError(409, "Email already exist, choose another"));
    }

    if (!currentUserName || !currentEmail) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        userName: userName,
        email: email,
        password: hashedPassword,
      });

      const access_token = generateToken(user._id, user.role);
      let setToken = await createToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      if (!setToken) return next(createHttpError(400, "Error creating token"));
      const messageLink = `${env.BASE_URL}/verify-email/${user._id}/${setToken.token}`;
      if (!messageLink)
        return next(createHttpError(400, "Verification message not sent"));
      await sendEmail({
        userName: userName,
        from: env.USER_MAIL_LOGIN,
        to: user.email,
        subject: " Email verification link",
        text: `Hello,  ${userName}, please verify your email by clicking this link ${messageLink}. Link expires in 30 minutes`,
      });
      res
        .status(201)
        .json({ access_token, msg: "User registration successfull" });
    }
  } catch (error) {
    next(error);
  }
};

export const sendEmailVerificationLink = async (req, res, next) => {
  const { id: userId } = req.params;
  try {
    if (!userId) return next(createHttpError(400, "Invalid userId"));
    const user = await User.findOne({ _id: userId });
    if (!user) return next(createHttpError(400, "User does not exist"));
    let setToken = await createToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    if (!setToken) return next(createHttpError(400, "Error creating token"));
    const messageLink = `${env.BASE_URL}/verify-email/${user._id}/${setToken.token}`;
    if (!messageLink)
      return next(createHttpError(400, "Verification message not sent"));
    await sendEmail({
      userName: user.userName,
      from: env.USER_MAIL_LOGIN,
      to: user.email,
      subject: " Email verification link",
      text: `hello,  ${user.userName}, please verify your email by clicking this link ${messageLink}. Link expires in 30 minutes`,
    });
    res.status(200).json({ msg: "Verification message sent" });
  } catch (error) {
    next(error);
  }
};

export const verifyAccount = async (req, res, next) => {
  const { id: userId, token: token } = req.params;
  try {
    if (!isValidObjectId(userId)) {
      return next(createHttpError(400, `Invalid userId: ${userId}`));
    }
    if (!userId || !Token) {
      return next(createHttpError(400, "Invalid params token maybe broken"));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(400, "User not found"));
    }
    if (user.isVerified) {
      return res.status(401).send("User has already been verified");
    }

    const getToken = await verifyToken({ userId, token });
    if (!getToken) {
      return next(createHttpError(401, "Invalid or expired token"));
    } else {
      await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
      res.status(200).send("Email account verified successfully");
    }
  } catch (error) {
    next(error);
  }
};

export const Login = async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    if (!userName || !password) {
      return next(createHttpError(400, "Form fields missing"));
    }
    const user = await User.findOne({ userName: userName }).select("+password");
    if (!user) {
      return next(createHttpError(401, "Username or Password is incorrect"));
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return next(createHttpError(401, "Username or Password is incorrect"));
    }
    const access_token = generateToken(user._id, user.role);
    res.status(200).json({ access_token, msg: "Login successful" });
  } catch (error) {
    next(error);
  }
};

export const authenticateUser = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    if (!isValidObjectId(userId)) {
      return next(createHttpError(400, `Invalid userId: ${userId}`));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(400, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  const { userName } = req.params;
  try {
    if (!userName) {
      return next(createHttpError(400, "No params requested"));
    }
    const user = await User.findOne({ userName: userName });
    if (!user) {
      return next(createHttpError(404, `User not found ${userName}`));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  const { id: userId } = req.user;
  const { userName, email, password, profilePhoto, bio } = req.body;
  try {
    if (!isValidObjectId(userId)) {
      return next(createHttpError(400, `Invalid userId: ${userId}`));
    }
    if (!userId) {
      return next(createHttpError(404, "User not found"));
    }

    const updatedFields = {
      userName,
      email,
      password: password && (await bcrypt.hash(password, 10)),
      profilePhoto,
      bio,
    };
    Object.keys(updatedFields).forEach(
      (key) =>
        (updatedFields[key] === " " || undefined) && delete updatedFields[key]
    );
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });
    if (!updatedUser) {
      return next(createHttpError(404, "User not found"));
    }
    if (!updatedUser._id.equals(userId)) {
      return next(createHttpError(404, "You cannot access this user"));
    }
    res
      .status(200)
      .json({ user: updatedUser, msg: "User info update successfully" });
  } catch (error) {
    next(error);
  }
};

export const recoverPasswordLink = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return next(createHttpError(400, "Email is missing"));
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return next(createHttpError(404, "Email no found"));
    }
    let setToken = await createToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    if (!setToken) return next(createHttpError(400, "Error creating token"));
    const messageLink = `${env.BASE_URL}/reset-password/${user._id}/${setToken.token}`;

    if (!messageLink)
      return next(createHttpError(400, "Verification message not sent"));
    await sendEmail({
      userName: user.userName,
      from: env.USER_MAIL_LOGIN,
      to: user.email,
      subject: "Password Recovering link",
      text: `Hello,  ${user.userName}, please click the link: to reset your password ${messageLink}. Link expires in 30 minutes`,
    });
  } catch (error) {
    next(error);
  }
};

export const resetUserPassword = async (req, res, next) => {
  const { id: userId, token: token } = req.params;
  const { password } = req.body;
  try {
    if (!isValidObjectId(userId)) {
      return next(createHttpError(400, "Invalid userId"));
    }
    if (!password || !token) {
      return next(createHttpError(400, "Invalid params token maybe broken"));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(400, "User not found"));
    }
    const getToken = await verifyToken({ userId, token });
    if (!getToken) {
      return next(createHttpError(401, "Invalid or expired token"));
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await User.updateOne({ _id: user._id }, { password: hashedPassword });
      res.status(200).send("Password updated!");
    }
  } catch (error) {
    next(error);
  }
};

export const followAUser = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: followId } = req.params;
  try {
    if (!isValidObjectId(userId) || !isValidObjectId(followId)) {
      return next(createHttpError(401, "Invalid id"));
    }
    if (!userId || !followId) {
      return next(createHttpError(401, "User parameters missing"));
    }
    if (userId === followId) {
      return next(createHttpError(401, "You can't follow yourself"));
    }
    await User.findByIdAndUpdate(userId, {
      $push: { following: followId },
    });
    await User.findByIdAndUpdate(followId, {
      $push: { followers: userId },
    });
    res.status(200).send("Following user successfull");
  } catch (error) {
    next(error);
  }
};
export const unFollowAUser = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: followId } = req.params;
  try {
    if (!isValidObjectId(userId) || !isValidObjectId(followId)) {
      return next(createHttpError(401, "Invalid id"));
    }
    if (!userId || !followId) {
      return next(createHttpError(401, "User parameters missing"));
    }
    if (userId === followId) {
      return next(createHttpError(401, "You can't unfollow yourself"));
    }
    await User.findByIdAndUpdate(userId, {
      $pull: { following: followId },
    });
    await User.findByIdAndUpdate(followId, {
      $pull: { followers: userId },
    });
    res.status(200).send("Unfollowed user successfull");
  } catch (error) {
    next(error);
  }
};

export const getFollowedUser = async (req, res, next) => {
  const { id: userId } = req.params;
  try {
    if (!isValidObjectId(userId)) {
      return next(createHttpError(401, "Invalid userId"));
    }
    const findUser = await User.findById(userId);
    if (!findUser) {
      return next(createHttpError(404, "user not found"));
    }
    const getFollowedIds = findUser.following.map((user) => user);
    const user = await User.find({ _id: getFollowedIds });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req, res, next) => {
  const { id: userId } = req.params;
  try {
    if (!isValidObjectId(userId)) {
      return next(createHttpError(401, "Invalid userId"));
    }
    const findUser = await User.findById(userId);
    if (!findUser) {
      return next(createHttpError(404, "user not found"));
    }
    const getFollowedIds = findUser.Followers.map((user) => user);
    const user = await User.find({ _id: getFollowedIds });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};