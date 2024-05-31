import express, { Request, Response, urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import facebookAuthRouter from "./controllers/facebookAuth.controller";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // Use a strong and secure secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true if using HTTPS
  })
);
app.use("/auth/facebook", facebookAuthRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
