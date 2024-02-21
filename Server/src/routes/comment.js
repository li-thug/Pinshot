import express from "express";
import * as CommentController from "../controllers/comment.js";
import { verifyToken, Roles } from "../middleware/authVerify.js";

const router = express.Router();

router.post("/:id/add", verifyToken(Roles.All), CommentController.addAComment);

router.get("/:id", verifyToken(Roles.All), CommentController.getComments);

router.put("/:id/like", verifyToken(Roles.All), CommentController.likeAComment);

router.put(
  "/:id/dislike",
  verifyToken(Roles.All),
  CommentController.dislikeAComment
);

router.delete(
  "/:id",
  verifyToken(Roles.All),
  CommentController.deleteAComment
);

export default router;
