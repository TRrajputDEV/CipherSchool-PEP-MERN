import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

// Save minimal user info into session
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user);
});

// Read user back from session
passport.deserializeUser((user, done) => {
  console.log("Deserializing user:", user);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google profile received:", profile);
      // We only keep what we need — no DB User model needed
      const user = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
      };
      console.log("User object created:", user);
      return done(null, user);
    }
  )
);