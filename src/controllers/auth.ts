import { Request, Response } from "express";
import { genSalt, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { Membership, User } from "@prisma/client";
import dotenv from "dotenv";
import { findUserById } from "../services/user.service";

dotenv.config();

interface UserWithMembership extends User {
  membership?: Membership;
}

const secretKey = process.env.JWT_SECRET_KEY;
export function generateJWT(user: any) {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      facebookId: user.facebookId,
      googleId: user.googleId,
      membership: user.membership,
    },
    secretKey!,
    {
      expiresIn: "1d",
    }
  );
  return token;
}

export async function generateHashedPassword(password: string) {
  try {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password", error);
    throw error;
  }
}

export function tokenVerification(req: Request, res: Response) {
  try {
    const { token, secret } = req.query;
    const decodedUser = jwt.verify(token as string, secret as string);
    res.status(200).json(decodedUser);
  } catch (error) {
    console.error(error);
  }
}
