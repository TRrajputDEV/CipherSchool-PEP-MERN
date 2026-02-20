import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

import "./config/passport.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import confessionRoutes from "./routes/confession.routes.js";
import userRoutes from "./routes/user.routes.js"
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // allow cookies from frontend
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/api/auth", authRoutes);
app.use("/api/confessions", confessionRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running → http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });