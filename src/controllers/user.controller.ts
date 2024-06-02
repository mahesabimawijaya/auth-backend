import { Request, Response } from "express";
import { createMembership, findMembershipByEmail, findUserById } from "../services/user.service";
import { generateHashedPassword, generateJWT } from "./auth";
import bcrypt from "bcrypt";
import { Membership } from "@prisma/client";

const webURL = process.env.WEB_URL;

export async function createUserMembership(req: Request, res: Response) {
  try {
    const { email, password: rawPassword, userId, type } = req.body;
    const existedUser = await findMembershipByEmail(email);
    if (existedUser) return res.status(202).send("Email already used");
    const password = await generateHashedPassword(rawPassword);
    let articles = 0;
    let videos = 0;
    if (type === "Type A") {
      articles = 3;
      videos = 3;
    } else if (type === "Type B") {
      articles = 10;
      videos = 10;
    } else {
      articles = 10000;
      videos = 10000;
    }
    const newMembership = await createMembership(email, password, type, userId, articles, videos);
    const user = await findUserById(newMembership.userId);
    const token = generateJWT(user);
    res.cookie("astronacci-auth-token", token, { maxAge: 1000 * 60 * 60 * 24 });
    return res.status(201).json(newMembership);
  } catch (error) {
    console.error(error);
  }
}

export async function loginUserMembership(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const membership = await findMembershipByEmail(email);
    const matchPassword = await bcrypt.compare(password, membership?.password ? membership.password : "");
    if (!membership || !matchPassword) {
      return res.status(201).send({ message: "Wrong email or password" });
    } else {
      const token = generateJWT(membership);
      res.cookie("astronacci-membership-token", token, { maxAge: 1000 * 60 * 60 * 24 });
      res.status(200).json(membership);
    }
  } catch (error) {
    console.error(error);
  }
}
