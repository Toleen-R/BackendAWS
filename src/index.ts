// Importerar nödvändiga moduler
import express from "express"; // Express används för att skapa och konfigurera servern.
import passport from "passport"; // Passport används för autentisering.
import session from "express-session"; // Hanterar sessionslagring.
import dotenv from "dotenv"; // Laddar miljövariabler från en .env-fil.
import cors from "cors"; // Hanterar CORS (Cross-Origin Resource Sharing) för att tillåta API-åtkomst från olika ursprung.
import "./authStrategies/localStrategy.js"; // Laddar lokal autentiseringsstrategi (ex. Passport Local Strategy).

// Importerar routrar för specifika funktioner
import { campaignRoutes } from "./routes/campaign.js"; // Hanterar endpoints för kampanjer.
import authRouter from "./routes/auth.js"; // Hanterar autentiseringsrelaterade endpoints.
import { router as userRouter } from "./routes/user.js"; // Hanterar användarrelaterade endpoints.

import { Pool } from "pg"; // Pool används för att hantera databasanslutningar.

// Skapar en instans av Express-applikationen
const app = express();

// Definierar tillåtna ursprung för CORS beroende på miljön (produktion eller utveckling)
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://main.d3i4nshersmiyz.amplifyapp.com/"] // Tillåtet ursprung i produktionsmiljö.
    : ["http://localhost:5173"]; // Tillåtet ursprung i utvecklingsmiljö.

// Konfigurerar CORS-inställningar
const corsOptions = {
  origin: allowedOrigins, // Tillåtna ursprung.
  credentials: true, // Tillåt användning av cookies.
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Tillåtna HTTP-metoder.
  allowedHeaders: ["Content-Type", "Authorization"], // Tillåtna HTTP-rubriker.
};
app.use(cors(corsOptions)); // Aktiverar CORS i Express.

// Laddar miljövariabler från .env-filen
dotenv.config();

// // Exempel för en GitHub-strategi (kommenterad just nu)
// // Konfigurerar sessionshantering
// app.use(
//   session({
//     secret: "hemligt", // Hemlig nyckel för att kryptera sessionsdata.
//     resave: false, // Spara inte sessionen om den inte ändrats.
//     saveUninitialized: true, // Skapa session även om inga data lagras.
//     cookie: {
//       secure: process.env.NODE_ENV === "production", // Använd säkra cookies i produktion.
//     },
//   })
// );

// Ställer in "trust proxy" för att stödja proxy-servrar
app.set("trust proxy", 1);

// Konfigurerar sessionshantering och Passport
app.use(express.json()); // Aktiverar JSON-parsing för inkommande förfrågningar.
app.use(
  session({
    secret: process.env.SESSION_SECRET || "helloWorld", // Hemlig nyckel för sessioner.
    resave: false, // Spara inte sessioner om de inte ändras.
    saveUninitialized: false, // Skapa inte onödiga sessioner.
    proxy: true, // Använd proxy-stöd.
    cookie: {
      secure: process.env.NODE_ENV === "production", // Endast säkra cookies i produktion.
      maxAge: 24 * 60 * 60 * 1000, // Cookies är giltiga i 24 timmar.
    },
  })
);

app.use(passport.initialize()); // Initierar Passport.
app.use(passport.session()); // Binder Passport till sessionen.

// Definierar API-rutter
app.use("/campaign", campaignRoutes); // Rutter för kampanjer.
app.use("/users", userRouter); // Rutter för användare.
app.use("/auth", authRouter); // Rutter för autentisering.

// Testroute för att kontrollera att servern fungerar
app.get("/", (req, res) => {
  res.send("Hello from Backend  😊 ");
});

// Kontrollerar om servern körs på Vercel eller lokalt
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000; // Sätt port från miljövariabel eller standardport 3000.
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}, Link => http://localhost:3000`)
  );
}

// Exporterar appen för att möjliggöra enhetstester eller integration i andra moduler
export default app;
