import express from "express";
import * as searchController from "../controllers/search.js";
import { verifyToken, Roles } from "../middleware/authVerify.js";

const router = express.Router();

router.get("/", verifyToken(Roles.All), searchController.searchDb);

router.get("/tags", verifyToken(Roles.All), searchController.getTags);

router.get("/:id/tags", verifyToken(Roles.All), searchController.deleteAtag);


export default router;
