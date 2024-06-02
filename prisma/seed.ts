// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  for (let i = 1; i <= 20; i++) {
    await prisma.video.create({
      data: {
        title: "video" + i,
        url: "url" + i,
      },
    });
    console.log(`Created video ${i}`);
  }
  for (let i = 1; i <= 20; i++) {
    await prisma.article.create({
      data: {
        title: "article" + i,
        content: "content" + i,
      },
    });
    console.log(`Created article ${i}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
