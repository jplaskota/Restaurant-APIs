import express from "express";
import { Request, Response } from "express";
import { parse } from "path";
import { json } from "stream/consumers";
import { Note } from "./note";
import { Tag } from "./tag";
import fs, { write } from "fs";

const app = express();

app.use(express.json());

app.get("/", function (req: Request, res: Response) {
  res.send("GET Hello World");
});

app.post("/", function (req: Request, res: Response) {
  console.log(req.body); // e.x. req.body.title
  res.status(200).send("POST Hello World");
});

//konwersatorium

// async function readFile(filepath: string): Promise<string> {
//   const a = await fs.promises.readFile(filepath, "utf8");
//   return a;
// }

// const aa = await readFile("src/data/notes.json");

// function readFileSync(file: Note, callback: any): string {
//   return fs.readFileSync(file, "utf8", callback);
// }
// let fileData = "";
// function readFileCallback(err: any, data: string): void {
//   if (err) {
//     console.log(err);
//   } else {
//     fileData = data;
//   }
// }

// koniec konwersatorium

let notes: Note[] = [];
let tagsList: Tag[] = [];

async function Write(): Promise<void> {
  var fs = require("fs");
  await fs.writeFileSync("src/data/notes.json", JSON.stringify(notes));
  await fs.writeFileSync("src/data/tags.json", JSON.stringify(tagsList));
}

async function Read(): Promise<void> {
  var fs = require("fs");

  var data = await fs.readFileSync("src/data/notes.json", "utf8");
  if (data) {
    notes = JSON.parse(data);
  }

  data = await fs.readFileSync("src/data/tags.json", "utf8");
  if (data) {
    tagsList = JSON.parse(data);
  }

  console.log(notes);
}

app.get("/notes", async function (req: Request, res: Response) {
  await Read();
  res.send(notes);
});

app.get("/note/:id", async function (req: Request, res: Response) {
  await Read();
  const note = notes.find((a) => a.id === parseInt(req.params.id));
  if (note) {
    res.status(200).send(note);
  } else {
    res.status(404).send("Not Found");
  }
});

app.post("/note", async function (req: Request, res: Response) {
  await Read();
  let tag: Tag = {
    id: tagsList.length + 1,
    name: "basic",
  };

  const isTag = tagsList.find((a) => a.name === req.body.tag.name);
  if (!isTag && req.body.tag) {
    const newTag: Tag = {
      id: tagsList.length + 1,
      name: req.body.tag.name,
    };
    tagsList.push(newTag);
    tag = newTag;
  } else if (!req.body.tag) {
    const basicTag = tagsList.find((a) => a.name === "basic");
    if (!basicTag) {
      const basicTag: Tag = {
        id: tagsList.length + 1,
        name: "basic",
      };
      tagsList.push(basicTag);
      tag = basicTag;
    }
  } else if (isTag) {
    tag = isTag;
  }

  if (req.body.title && req.body.content) {
    const note: Note = {
      title: req.body.title,
      content: req.body.content,
      createDate: new Date().toISOString(),
      tags: tag,
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
