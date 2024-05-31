import { Request, Response } from "express";
import { User } from "@prisma/client";
import { genSalt, hash } from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY;
export function generateJWT(user: User, info?: string | { [key: string]: any } | null, expiresIn?: SignOptions["expiresIn"]) {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      info: info,
      googleId: user?.facebookId,
    },
    secretKey!,
    {
      expiresIn: expiresIn || "1d",
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
    const user = jwt.verify(token as string, secret as string);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
  }
}
