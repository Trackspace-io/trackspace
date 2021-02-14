import cors from "cors";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import path from "path";
import { ShortLink } from "./models/ShortLink";
import { User } from "./models/User";
import Server from "./Server";

const app = express();
const port = process.env.PORT || 8000;

// Configure Express.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  app.use(cors());
}

// Configure Passport.
passport.use(new LocalStrategy(User.authenticate));

passport.serializeUser((user: User, done) => {
  done(null, user.getDataValue("id"));
});

passport.deserializeUser(function (id: string, done) {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((e) => {
      done(e);
    });
});

// Serve the API routes.
app.use("/api", Server.get().router);

// Serve the public assets files.
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Short links.
app.get("/l/:id", async (req, res) => {
  const shortLink = await ShortLink.findOne({ where: { id: req.params.id } });

  if (
    !shortLink ||
    (shortLink.expirationDate && shortLink.expirationDate < new Date())
  ) {
    return res.status(404).send("Not found.");
  }

  return res.redirect(shortLink.fullUrl);
});

// Serve static files from the React app.
app.use(express.static(path.join(__dirname, "../../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

// Start the server.
app.listen(port, () => {
  console.log(`⚡️ Server is running at https://localhost:${port}`);
});
