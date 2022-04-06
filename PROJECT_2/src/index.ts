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

async function readStorage(): Promise<void> {
  try {
    const datan = await fs.promises.readFile("src/data/notes.json", "utf-8");
    notes = JSON.parse(datan);
    const datat = await fs.promises.readFile("src/data/tags.json", "utf-8");
    tagsList = JSON.parse(datat);
  } catch (err) {
    console.log(err);
  }
}

async function updateStorage(): Promise<void> {
  try {
    await fs.promises.writeFile("src/data/notes.json", JSON.stringify(notes));
    await fs.promises.writeFile("src/data/tags.json", JSON.stringify(tagsList));
  } catch (err) {
    console.log(err);
  }
}

app.get("/notes", function (req: Request, res: Response) {
  readStorage();
  res.send(notes);
});

app.get("/note/:id", async function (req: Request, res: Response) {
  await readStorage();
  const note = notes.find((a) => a.id === parseInt(req.params.id));
  if (note) {
    res.status(200).send(note);
  } else {
    res.status(404).send("Not Found");
  }
});

app.post("/note", async function (req: Request, res: Response) {
  await readStorage();
  let tag: Tag = {
    id: tagsList.length + 1,
    name: "basic",
  };
  const basicExists = tagsList.find((a) => a.name === "basic");
  if (!basicExists) {
    tagsList.push(tag);
  }
  await updateStorage();

  if (req.body.tags) {
    req.body.tags.forEach((a: string) => {
      const tagExists = tagsList.find((b) => b.name === a);
      if (tagExists) {
        tag = tagExists;
        console.log("nic");
      } else {
        tagsList.push(tag);
      }
    });
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
    await updateStorage();

    res.sendStatus(201);
  } else {
    res.status(400).send("Not Created");
  }
});

app.put("/note/:id", async (req: Request, res: Response) => {
  await readStorage();

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
    await updateStorage();

    res.status(204).send("Updated");
  }
});

app.delete("/note/:id", async (req: Request, res: Response) => {
  await readStorage();

  const note = notes.find((a) => a.id === parseInt(req.params.id));
  if (!note) {
    res.status(400).send("Not Found");
  } else {
    const index = notes.indexOf(note);
    notes.splice(index, 1);
    await updateStorage();
    res.status(204).send("Deleted");
  }
});

app.listen(3000);
