import express from "express";
import { Request, Response } from "express";
import { parse } from "path";
import { Note } from "./note";

const app = express();

app.use(express.json());

app.get("/", function (req: Request, res: Response) {
  res.send("GET Hello World");
});

app.post("/", function (req: Request, res: Response) {
  console.log(req.body); // e.x. req.body.title
  res.status(200).send("POST Hello World");
});

const notes: Note[] = [
  {
    title: "a",
    content: "one",
    createDate: "1-01-2022",
    tags: ["a", "b", "c"],
    id: 1,
  },
  {
    title: "b",
    content: "two",
    createDate: "2-02-2022",
    tags: ["a", "c"],
    id: 2,
  },
];

app.get("/note/:id", function (req: Request, res: Response) {
  const note = notes.find((a) => a.id === parseInt(req.params.id));
  if (note) {
    res.status(200).send(note);
  } else {
    res.status(404).send("Not Found");
  }
});

app.post("/note", (req: Request, res: Response) => {
  if (req.body.title && req.body.content) {
    const note: Note = {
      title: req.body.title,
      content: req.body.content,
      createDate: new Date().toISOString(),
      tags: req.body.tags,
      id: notes.length + 1,
    };

    notes.push(note);
    res.sendStatus(201);
  } else {
    res.status(400).send("Not Created");
  }
});

app.put("/note/:id", (req: Request, res: Response) => {
  const note = notes.find((a) => a.id === parseInt(req.params.id));
  if (!note) {
    res.status(404).send("Not Found");
  }
  else {
    const newnote: Note = {
      title: req.body.title,
      content: req.body.content,
      createDate: note.createDate ?? new Date().toISOString(),
      tags: !req.body.tags ? note.tags : req.body.tags,
      id: note.id,
    };
    const index = notes.indexOf(note);
    notes[index] = newnote;
    res.status(204).send("Updated");
  }
});

app.delete("/note/:id", (req: Request, res: Response) => {
  const note = notes.find((a) => a.id === parseInt(req.params.id));
  if (!note) {
    res.status(400).send("Not Found");
  }
  else {
    const index = notes.indexOf(note);
    notes.splice(index, 1);
    res.status(204).send("Deleted");
  }
});

app.listen(3000);
