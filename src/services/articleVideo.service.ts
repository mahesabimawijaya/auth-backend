import { prisma } from "./prisma.service";

export async function getAllVideos(limit: number) {
  return await prisma.video.findMany({
    take: limit,
  });
}

export async function getAllArticles(limit: number) {
  return await prisma.article.findMany({
    take: limit,
  });
}
