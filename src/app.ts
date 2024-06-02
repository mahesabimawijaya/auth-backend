import express, { Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import facebookAuthRouter from "./controllers/facebookAuth.controller";
import googleAuthRouter from "./controllers/googleAuth.controller";
import authRouter from "./routers/authRouter";
import userRouter from "./routers/user.router";
import articleVideoRouter from "./routers/articleVideo.router";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use("/auth/facebook", facebookAuthRouter);
app.use("/auth/google", googleAuthRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/content", articleVideoRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
