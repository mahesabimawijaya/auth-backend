import express, { Request, Response } from "express";
import { tokenVerification } from "../controllers/auth";

const router = express.Router();

router.get("/verify-token", tokenVerification);

export default router;
