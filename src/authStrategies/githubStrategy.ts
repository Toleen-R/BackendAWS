import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { UserProfile } from "../types/types.js";
import dotenv from "dotenv";

dotenv.config(); // Laddar miljövariabler från .env-filen, t.ex. GITHUB_CLIENT_ID och GITHUB_CLIENT_SECRET

// Använd GitHub-strategin
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string, // Klient-ID från GitHub-applikationen
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, // Klientens hemlighet från GitHub
      callbackURL: "http://localhost:5173/", // URL dit GitHub ska omdirigera efter inloggning
    },
    (
      accessToken: string, // Token som används för att komma åt användarens GitHub-data
      refreshToken: string, // Token för att förnya accessToken, om tillgängligt
      profile: any, // GitHub-användarens profilinformation
      done: (err: any, user?: UserProfile | null) => void // Callback-funktion för att hantera resultatet
    ) => {
      try {
        // Logga profil för felsökning
        console.log(profile); // Visar hela profilobjektet i konsolen

        // Skapa ett användarobjekt från GitHub-profilen
        const user: UserProfile = {
          id: profile.id, // GitHub-användarens unika ID
          username: profile.username || profile.displayName, // GitHub-användarnamn eller display-namn
          displayName: profile.displayName, // Fullständigt namn
          profileUrl: profile.profileUrl || "", // Länk till GitHub-profil (om tillgängligt)
          emails: profile.emails || [], // Lista över e-postadresser (om tillgängligt)
        };

        console.log(user); // Visar det bearbetade användarobjektet i konsolen

        return done(null, user); // Returnerar det skapade användarobjektet till Passport
      } catch (err) {
        // Hanterar fel under autentisering
        console.error("Error during authentication", err); // Loggar fel i konsolen
        return done(err); // Skickar fel till Passport
      }
    }
  )
);
