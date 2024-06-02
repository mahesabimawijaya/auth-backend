import express from "express";
import { createUserMembership, loginUserMembership } from "../controllers/user.controller";

const router = express.Router();

router.post("/register", createUserMembership);
router.post("/login", loginUserMembership);

export default router;
