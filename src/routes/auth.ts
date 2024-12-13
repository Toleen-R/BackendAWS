import { Router } from "express"; // Importerar Router från Express för att hantera routes
import passport from "passport"; // Importerar Passport för autentisering
import "../authStrategies/githubStrategy.js"; // Importerar GitHub-strategi för Passport
import "../authStrategies/localStrategy.js"; // Importerar lokal autentiseringsstrategi för Passport
import { Request, Response, NextFunction } from "express"; // Importerar typer för typning av request och response

const app = Router(); // Skapar en ny instans av en router

// Route för att starta autentisering med GitHub
app.get("/", passport.authenticate("github")); // Initierar Passport GitHub-strategin

// Route för att hantera GitHub-autentiseringens callback
app.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/" }), // Hanterar GitHub-autentiseringens callback och omdirigerar vid fel
  function (req: Request, res: Response) {
    // Om autentiseringen lyckas, omdirigera användaren till klienten med en query parameter
    res.redirect("http://localhost:5173/?loggedIn=true");
  }
);

app.get("/profile", (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/github");
  }
  res.json(req.user);
});

// localStrategy
app.post(
  "/login",
  passport.authenticate("local"),
  (req: Request, res: Response) => {
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    try {
      // Dubbel error-handling?? :-)
      req.logIn(user, (err) => {
        if (err)
          return res.status(500).json({ message: "Internal server error" });
        else
          res.json({
            message: "Logged in successfully",
            user: { id: user.id, email: user.email, name: user.name },
            redirectUrl: "/campaigns",
          });
      });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
);

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  res.json(req.user);
});

// ---------------------------------------------------------------------------
// Utloggningsrutt
app.get("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Error logging out" });
    }
    res.redirect("http://localhost:5173/");
  });
});
// ---------------------------------------------------------------------------

// Exporterar router-objektet
export default app;
