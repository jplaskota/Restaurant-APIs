import express from "express";
import { Request, Response } from "express";
import { parse } from "path";
import { json } from "stream/consumers";
import { Note } from "./note";
import fs from "fs";

const app = express();

app.use(express.json());

app.get("/", function (req: Request, res: Response) {
  res.send("GET Hello World");
});

app.post("/", function (req: Request, res: Response) {
  console.log(req.body); // e.x. req.body.title
  res.status(200).send("POST Hello World");
});

let notes: Note[] = [];

function Write(): void {
  var fs = require("fs");
  fs.writeFileSync("src/data/notes.json", JSON.stringify(notes));
}

function Read(): void {
  var fs = require("fs");
  notes = JSON.parse(fs.readFileSync("src/data/notes.json"));
}

app.get("/note/:id", function (req: Request, res: Response) {
  Read();
  const note = notes.find((a) => a.id === parseInt(req.params.id));
  if (note) {
    res.status(200).send(note);
  } else {
    res.status(404).send("Not Found");
  }
});

app.post("/note", (req: Request, res: Response) => {
  Read();
  if (req.body.title && req.body.content) {
    const note: Note = {
      title: req.body.title,
      content: req.body.content,
      createDate: new Date().toISOString(),
      tags: req.body.tags,
      id: notes.length + 1,
    };

    notes.push(note);
    Write();

    res.sendStatus(201);
  } else {
    res.status(400).send("Not Created");
  }
});

app.put("/note/:id", (req: Request, res: Response) => {
  Read();
  const note = notes.find((a) => a.id === parseInt(req.params.id));
  if (!note) {
    res.status(404).send("Not Found");
  } else {
    const newnote: Note = {
      title: req.body.title,
      content: req.body.content,
      createDate: note.createDate ?? new Date().toISOString(),
      tags: !req.body.tags ? note.tags : req.body.tags,
      id: note.id,
    };
    const index = notes.indexOf(note);
    notes[index] = newnote;
    Write();
    res.status(204).send("Updated");
  }
});

app.delete("/note/:id", (req: Request, res: Response) => {
  Read();
  const note = notes.find((a) => a.id === parseInt(req.params.id));
  if (!note) {
    res.status(400).send("Not Found");
  } else {
    const index = notes.indexOf(note);
    notes.splice(index, 1);
    Write();
    res.status(204).send("Deleted");
  }
});

app.listen(3000);
