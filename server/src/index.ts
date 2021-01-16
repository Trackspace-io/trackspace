import express from "express";
import path from "path";
import Server from "./Server";

const app = express();
const port = process.env.PORT || 8000;

// Enable JSON requests.
app.use(express.json());

// Serve the API routes
app.use("/api", Server.get().router);

// Serve static files from the React app.
app.use(express.static(path.join(__dirname, "../../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

app.listen(port, () => {
  console.log(`⚡️ Server is running at https://localhost:${port}`);
});
