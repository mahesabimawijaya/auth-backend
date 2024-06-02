import express, { Request, Response } from "express";
import passport from "passport";
import { User } from "@prisma/client";
import { generateJWT } from "./auth";
import dotenv from "dotenv";
import { prisma } from "../services/prisma.service";
import { createByFacebook, findUserByEmail, findUserById, updateFacebookId } from "../services/user.service";
const FacebookStrategy = require("passport-facebook").Strategy;

dotenv.config();

const router = express.Router();
const webURL = process.env.WEB_URL;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "email"],
    },
    async function (accessToken: any, refreshToken: any, profile: any, cb: any) {
      try {
        const user = await findUserByEmail(profile.emails[0].value);
        if (user && !user.facebookId) {
          const updatedUser = await updateFacebookId(user.id, profile.id);
          return cb(null, updatedUser);
        }
        if (!user) {
          const user = await prisma.user.create({
            data: {
              username: profile.displayName,
              facebookId: profile.id,
              email: profile.emails.length > 0 ? profile.emails[0].value : "no email",
            },
          });
          console.log(user);
          return cb(null, profile);
        }
        return cb(null, profile);
      } catch (error) {
        console.error(error);
        cb(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

router.get("/", passport.authenticate("facebook", { scope: "email" }));
router.get(
  "/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${webURL}auth/facebook/error`,
  }),
  async function (req: any, res: Response) {
    const user = await findUserByEmail(req.user?.emails[0].value);
    const token = generateJWT(user as User);
    res.cookie("astronacci-auth-token", token, { maxAge: 1000 * 60 * 60 * 24 });
    res.redirect(`${webURL}`);
  }
);

router.get("/error", (req, res) => res.send("Error logging in via Facebook"));

router.get("/signout", (req: Request, res: Response) => {
  try {
    req.session.destroy(function (err: any) {
      console.log("session destroyed");
    });
    res.redirect(webURL!);
  } catch (error) {
    res.status(400).send({ message: "failed to sign out" });
  }
});
export default router;
