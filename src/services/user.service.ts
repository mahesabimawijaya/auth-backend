import { prisma } from "./prisma.service";

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      membership: true,
    },
  });
}
export async function findMembershipByEmail(email: string) {
  return await prisma.membership.findUnique({
    where: {
      email,
    },
  });
}

export async function findUserById(Id: number) {
  return await prisma.user.findUnique({
    where: {
      id: Id,
    },
    include: {
      membership: true,
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

export async function createMembership(email: string, password: string, type: string, userId: number, articles: number, videos: number) {
  return await prisma.membership.create({
    data: {
      email,
      password,
      type,
      userId,
      articles,
      videos,
    },
  });
}
