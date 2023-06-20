const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/api/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(req.body);
      const parsedNotes = JSON.parse(data);
      const newNote = req.body;
      req.body.id = parsedNotes.length + 1;
      parsedNotes.push(newNote);

      fs.writeFile("./db/db.json", JSON.stringify(parsedNotes), (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info("Successfully updated notes!")
      );
    }
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
