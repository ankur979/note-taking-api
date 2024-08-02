import { v4 as uuidv4 } from "uuid";

// In-memory data structure to store notes.
const id = uuidv4();
const notes = {
  [id]: {
    id,
    title: "First Note",
    content: "This is the first note.",
    tags: ["important"],
  },
};

export const getNotes = (req, res) => {
  res.json(Object.values(notes));
};

export const createNote = (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content || !tags) {
    return res.status(403).json({
      message: "all fields must be required",
    });
  }

  if (tags && !Array.isArray(tags)) {
    return res.status(400).json({ message: "Tags must be an array" });
  }

  const id = uuidv4();
  notes[id] = { id, title, content, tags: tags || [] };
  res.status(201).json(notes[id]);
};

export const updateNote = (req, res) => {
  const note = notes[req.params.id];
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  const { title, content, tags } = req.body;
  if (tags && !Array.isArray(tags)) {
    return res.status(400).json({ message: "Tags must be an array" });
  }
  note.title = title !== undefined ? title : note.title;
  note.content = content !== undefined ? content : note.content;
  note.tags = tags !== undefined ? tags : note.tags;
  res.status(200).json(note);
};

export const deleteNote = (req, res) => {
  const id = req.params.id;
  const note = notes[id];

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  delete notes[id];
  res.status(200).json({
    message: "Note deleted successfully",
  });
};

export const getSingleNote = (req, res) => {
  const id = req.params.id;
  const note = notes[id];

  if (!note) {
   return res.status(404).json({ message: "Note not found" });
  }

  res.status(200).json(note);
};

export const addTag = (req, res) => {
  const note = notes[req.params.id];
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  const { tags } = req.body;
  if (!tags || !Array.isArray(tags)) {
    return res.status(400).json({ message: "Tags must be an array" });
  }
  note.tags = [...new Set([...note.tags, ...tags])];
  res.status(201).json(note);
};

export const removeTag = (req, res) => {
  const note = notes[req.params.id];
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  const { tags } = req.body;
  if (!tags || !Array.isArray(tags)) {
    return res.status(400).json({ message: "Tags must be an array" });
  }
  note.tags = note.tags.filter((tag) => !tags.includes(tag));
  res.status(200).json(note);
};

export const noteQuery = (req, res) => {
  const { and, or, not } = req.query;

  try {
    let result = Object.values(notes);

    if (and) {
      const andTags = and.split(",");
      result = result.filter((note) =>
        andTags.every((tag) => note.tags.includes(tag))
      );
    }

    if (or) {
      const orTags = or.split(",");
      result = result.filter((note) =>
        orTags.some((tag) => note.tags.includes(tag))
      );
    }

    if (not) {
      const notTags = not.split(",");
      result = result.filter((note) =>
        notTags.every((tag) => !note.tags.includes(tag))
      );
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error processing query" });
  }
};
