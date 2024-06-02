import { Request, Response } from "express";
import { getAllArticles, getAllVideos } from "../services/articleVideo.service";

export async function getVideos(req: Request, res: Response) {
  try {
    const { limit } = req.query;
    const videos = await getAllVideos(Number(limit));
    return res.status(200).json(videos);
  } catch (error) {
    console.error(error);
  }
}
export async function getArticles(req: Request, res: Response) {
  try {
    const { limit } = req.query;
    const articles = await getAllArticles(Number(limit));
    return res.status(200).json(articles);
  } catch (error) {
    console.error(error);
  }
}
