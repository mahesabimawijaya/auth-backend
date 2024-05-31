import { prisma } from "./prisma.service";

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function updateFacebookId(userId: number, facebookId: string) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      facebookId: facebookId,
    },
  });
}

export async function createByFacebook(email: string, username: string, facebookId: string) {
  return await prisma.user.create({
    data: {
      email: email,
      username: username,
      facebookId: facebookId,
    },
  });
}
