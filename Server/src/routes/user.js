import express from "express";
import * as AuthController from "../controllers/user.js";
import { verifyToken, Roles } from "../middleware/authVerify.js";
import { genLimiter} from "../middleware/rateLimit.js";

const router = express.Router();

router.post("/signup", AuthController.signUp);
router.post("/login", genLimiter, AuthController.Login);

//verify user email
router.post(
  "/resend-token/:id",
  verifyToken(Roles.All),
  genLimiter,
  AuthController.sendEmailVerificationLink
);
router.patch(
  "/verify-account/:id/:token",
  verifyToken(Roles.All),
  genLimiter,
  AuthController.verifyAccount
);

//reset user Password
router.post("/verify-email", genLimiter, AuthController.recoverPasswordLink);
router.patch("/reset-password/:id/:token", genLimiter, AuthController.resetUserPassword);

//authenticte user
router.get("/", verifyToken(Roles.All), AuthController.authenticateUser);

router.get(
  "/profile/:userName",
  verifyToken(Roles.All),
  AuthController.getUserProfile
);

router.patch(
  "/update-user",
  verifyToken(Roles.All),
  AuthController.updateUserProfile
);

//user engagements
router.put("/follow/:id", verifyToken(Roles.All), AuthController.followAUser);
router.put(
  "/unfollow/:id",
  verifyToken(Roles.All),
  AuthController.unFollowAUser
);

router.get(
  "/following/:id",
  verifyToken(Roles.All),
  AuthController.getFollowedUser
);

router.get(
  "/followers/:id",
  verifyToken(Roles.All),
  AuthController.getFollowers
);

export default router;
