import passport from "passport";
import express, { Request, Response } from "express";
import { prisma } from "../services/prisma.service";
import { User } from "@prisma/client";
import { GoogleAuthResponse } from "../types/googleResponse";
import { generateJWT } from "./auth";
import { findUserById } from "../services/user.service";
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const router = express.Router();
const webURL = process.env.WEB_URL;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      proxy: true,
    },
    async (accessToken: any, refreshToken: any, profile: GoogleAuthResponse, done: any) => {
      try {
        const oldUser = await prisma.user.findUnique({ where: { email: profile.email } });
        if (oldUser && !oldUser.googleId) {
          const updatedUser = await prisma.user.update({
            where: {
              id: oldUser.id,
            },
            data: {
              googleId: profile.id,
            },
          });
          return done(null, updatedUser);
        }
        if (oldUser) return done(null, oldUser);
      } catch (error) {
        console.error(error);
        done(error, null);
      }

      try {
        const newUser = await prisma.user.create({
          data: {
            email: profile.email,
            username: profile.name.givenName + " " + profile.name.familyName,
            googleId: profile.id,
          },
        });

        done(null, newUser);
      } catch (error) {
        console.error(error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as User);
});

router.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: `${webURL}/auth/google/error`,
    session: false,
  }),
  async function (req: any, res: Response) {
    const user = await findUserById(req.user?.id);
    const token = generateJWT(user);
    res.cookie("astronacci-auth-token", token, { maxAge: 1000 * 60 * 60 * 24 });
    res.redirect(webURL!);
  }
);

router.get("/failed", (req: Request, res: Response) => res.send("Google authentication failed"));
router.get("/success", (req: Request, res: Response) => {
  res.redirect(webURL!);
});

export default router;
