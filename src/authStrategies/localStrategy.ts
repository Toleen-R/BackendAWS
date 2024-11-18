import { prisma } from "../prismaclient/prismaclient.js";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import passport from "passport";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        console.log("no user found");
        return done(null, false, { message: "Incorrect username." });
      }

      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          console.log("wrong password");
          return done(null, false, { message: "Incorrect password." });
        }
      });
      return done(null, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true, email: true, name: true },
    });
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (error) {
    done(error, null);
  }
});

export default passport;
