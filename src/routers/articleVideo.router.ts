import express from "express";
import { getArticles, getVideos } from "../controllers/articleVideo.controller";

const router = express.Router();

router.get("/videos", getVideos);
router.get("/articles", getArticles);

export default router;
