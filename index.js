// app.js

import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use the notes routes
app.use("/notes", notesRoutes);

// Catch-all route
app.get("/*", (req, res) => {
  res.json({ success: "true", message: "Hello world!" });
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
