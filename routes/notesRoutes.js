import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getSingleNote,
  addTag,
  removeTag,
  noteQuery,
} from "../controllers/notes.js";

const routes = express.Router();

routes.get("/", getNotes);
routes.get("/query", noteQuery);
routes.post("/", createNote);
routes.put("/:id", updateNote);
routes.get("/:id", getSingleNote);
routes.delete("/:id", deleteNote);
routes.put("/:id/tags", addTag);
routes.delete("/:id/tags", removeTag);

export default routes;
