import passport from "passport";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { prisma } from "../services/prisma.service";
import { generateJWT } from "./auth";
import { User } from "@prisma/client";
const FacebookStrategy = require("passport-facebook").Strategy;

const router = express.Router();
dotenv.config();

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
      const user = await prisma.user.findUnique({
        where: {
          facebookId: profile.id,
        },
      });
      if (!user) {
        console.log(profile);
        const user = await prisma.user.create({
          data: {
            username: profile.displayName,
            facebookId: profile.id,
            email: profile.emails.length > 0 ? profile.emails[0].value : "no email",
          },
        });
        console.log(user);
        return cb(null, profile);
      } else {
        return cb(null, profile);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id); // Serialize user.id into the session
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user); // Deserialize user from the session using user.id
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
  function (req: Request, res: Response) {
    const token = generateJWT(req.user as User);
    res.cookie("astronacci-auth-token", token, { maxAge: 1000 * 60 * 60 * 24 });
    res.redirect(`${webURL}/auth/facebook/success`);
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
