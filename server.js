const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = 3001;

const dbPath = "./db/db.json";
const publicDir = path.join(__dirname, "/public");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

app.get("/", (req, res) => {
  const indexPath = path.join(publicDir, "index.html");
  res.sendFile(indexPath);
});

app.get("/notes", (req, res) => {
  const notesPath = path.join(publicDir, "notes.html");
  res.sendFile(notesPath);
});

app.get("/api/notes", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    console.log(req.body);
    const parsedNotes = JSON.parse(data);
    res.json(parsedNotes);
  });
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    console.log(req.body);
    const parsedNotes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = uuidv4();
    parsedNotes.push(newNote);

    fs.writeFile(dbPath, JSON.stringify(parsedNotes, null, 4), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).send("Internal Server Error");
      }
      console.info("Successfully updated notes!");
      res.sendStatus(200);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    let parsedNotes = JSON.parse(data);
    const filteredNotes = parsedNotes.filter((note) => note.id !== noteId);

    if (parsedNotes.length === filteredNotes.length) {
      return res.status(404).send("Note not found");
    }

    parsedNotes = filteredNotes;

    fs.writeFile(dbPath, JSON.stringify(parsedNotes, null, 4), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).send("Internal Server Error");
      }
      console.info("Successfully deleted the note!");
      res.sendStatus(204);
    });
  });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT} 🚀`);
});
