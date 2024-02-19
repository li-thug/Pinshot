import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import User from "../models/user.model.js";
import Pin from "../models/pin.model.js";
import Comment from "../models/comment.model.js";

export const addAComment = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;
  const { comment } = req.body;
  try {
    if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
      return next(createHttpError(400, "Invalid user or pin id"));
    }
    if (!pinId) {
      return next(createHttpError(400, "PinId is missing"));
    }
    const pin = await Pin.findById(pinId);
    if (!pin) {
      return next(createHttpError(400, "pin not found"));
    }

    if (!comment) {
      return next(createHttpError(400, "comment is missing"));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    if (!user.isVerified) {
      return next(createHttpError(401, "Email not verified, pls verify to comment"));
    }
    const commentobj = {
      userId: user._id,
      pinId: pinId,
      comment: comment,
    };
    const comments = await Comment.create(commentobj);
    res.status(201).json({ comments, msg: "comment added successfully" });
  } catch (error) {
    next(error);
  }
};

export const getComment = async (req, res, next) => {
  const { id: pinId } = req.params;
  try {
    if (!isValidObjectId(pinId)) {
      return next(createHttpError(400, "Invalid pin id"));
    }
    if (!pinId) {
      return next(createHttpError(400, "PinId is missing"));
    }
    const pin = await Pin.findById(pinId);
    if (!pin) {
      return next(createHttpError(400, "pin not found"));
    }
    const comments = await Comment.find({ pinId: pinId })
      .populate("userId", "userName profilePhoto")
      .sort({ _id: -1 });
    if (!comments) {
      return next(createHttpError(404, "Comment not found"));
    }
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeAComment = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: commentId } = req.params;
  try {
    if (!isValidObjectId(userId) || !isValidObjectId(commentId)) {
      return next(createHttpError(400, "Invalid user or Comment id"));
    }
    if (!commentId) {
      return next(createHttpError(400, "commentId is missing"));
    }
    const comment = await Comment.findByIdAndUpdate(commentId, {
      $addToSet: { like: userId },
      $inc: { likeCount: 1 },
    });
    if (!comment) {
      return next(createHttpError(404, "Comment not find"));
    }
    if (comment.likes.includes(userId)) {
      res.status(400).send("You already like this comment!");
    }
    res.status(200).send("comment liked");
  } catch (error) {
    next(error);
  }
};

export const disLikeAComment = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: commentId } = req.params;
  try {
    if (!isValidObjectId(userId) || !isValidObjectId(commentId)) {
      return next(createHttpError(400, "Invalid user or Comment id"));
    }
    if (!commentId) {
      return next(createHttpError(400, "commentId is missing"));
    }
    const comment = await Comment.findByIdAndUpdate(commentId, {
      $pull: { like: userId },
      $inc: { likeCount: -1 },
    });
    if (!comment) {
      return next(createHttpError(404, "Comment not find"));
    }
    res.status(200).send("comment disliked");
  } catch (error) {
    next(error);
  }
};

export const deleteAComment = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: commentId } = req.params;
  try {
    if (!isValidObjectId(userId) || !isValidObjectId(commentId)) {
      return next(createHttpError(400, "Invalid user or Comment id"));
    }
    if (!commentId) {
      return next(createHttpError(400, "commentId is missing"));
    }
    const user = await User.findById(userId);
    const comment = Comment.findByIdAndDelete(commentId);
    if (!user._id.equals(comment.userId)) {
      return next(createHttpError(400, "You can only delete your own comment"));
    }
    if (!comment) {
      return next(createHttpError(400, "Comment not found"));
    }
    res.status(200).send("comment deleted!");
  } catch (error) {
    next(error);
  }
};
