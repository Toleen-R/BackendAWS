import { prisma } from "../prismaclient/prismaclient.js"; // Importerar Prisma-klienten för databasinteraktion
import { Strategy as LocalStrategy } from "passport-local"; // Importerar Passport.js Local-strategi
import bcrypt from "bcryptjs"; // Bibliotek för att hantera lösenordshashning och verifiering
import passport from "passport";

// Konfigurera LocalStrategy för Passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Fält som används för användarnamn, här är det e-post
      passwordField: "password", // Fält som används för lösenord
    },
    async function (email, password, done) {
      // Hämtar användare från databasen baserat på e-post
      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        console.log("no user found"); // Loggar om användare inte hittas
        return done(null, false, { message: "Incorrect username." }); // Returnerar felmeddelande om användaren inte finns
      }

      // Jämför inmatat lösenord med det hashade lösenordet i databasen
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
          return done(err); // Hanterar fel vid jämförelse
        }
        if (!isMatch) {
          console.log("wrong password"); // Loggar om lösenordet inte stämmer
          return done(null, false, { message: "Incorrect password." }); // Returnerar felmeddelande om lösenordet är fel
        }
      });

      return done(null, user); // Returnerar användaren om autentiseringen lyckas
    }
  )
);

// Serialiserar användarens data till en session
passport.serializeUser(function (user, done) {
  done(null, user); // Sparar användaren i sessionen
});

// Deserialiserar användarens data från en session
passport.deserializeUser(async (id: string, done) => {
  try {
    // Hämtar användarens data från databasen baserat på ID
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true, email: true, name: true }, // Hämtar endast nödvändig data
    });
    if (user) {
      done(null, user); // Returnerar användaren om den hittas
    } else {
      done(new Error("User not found"), null); // Hanterar fall där användaren inte hittas
    }
  } catch (error) {
    done(error, null); // Hanterar fel som uppstår vid deserialisering
  }
});

export default passport; // Exporterar Passport-instansen
