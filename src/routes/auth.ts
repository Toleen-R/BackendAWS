import { Router } from "express";
import passport from "passport";
import "../authStrategies/githubStrategy.js";
import "../authStrategies/localStrategy.js";
import { Request, Response, NextFunction } from "express";

const app = Router();

app.get("/", passport.authenticate("github"));

app.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function (req: Request, res: Response) {
    // res.redirect('/profile');
    // Indikerar att användaren är inloggad
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

export default app;
