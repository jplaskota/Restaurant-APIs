import express from "express";
import { Request, Response } from "express";
import { parse } from "path";
import { json } from "stream/consumers";
import { Note } from "./note";
import { User } from "./users";
import { Tag } from "./tag";
import fs from "fs";

const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

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
let tagsList: Tag[] = [];
let users: User[] = [
  {
    login: "admin",
    password: "admin",
    id: 1,
  },
  {
    login: "user",
    password: "user",
    id: 2,
  },
];

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

function auth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_KEY, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

// users

app.get("/users", auth, async function (req: any, res) {
  await readStorage();
  res.send(users.filter((x) => x.login === req.user.login));
});

app.post("/user", async function (req: Request, res: Response) {
  await readStorage();
  const user: User = req.body;
  user.id = users.length + 1;

  const token = jwt.sign(user, process.env.JWT_KEY);
  users.push(user);
  res.send({ token: token });
});

//notes

app.get("/notes", async function (req: Request, res: Response) {
  await readStorage();
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
    id: 0,
    name: "null",
  };

  const basicExists = tagsList.find((a) => a.name === "basic");
  if (!basicExists) {
    let tag: Tag = {
      id: tagsList.length + 1,
      name: "basic",
    };
    tagsList.push(tag);
  }
  await updateStorage();
  await readStorage();

  if (req.body.tags) {
    const tagExists = tagsList.find((b) => b.name === req.body.tags.name);
    if (tagExists) {
      tag.id = tagExists.id;
      tag.name = tagExists.name;
      console.log("nic");
    } else {
      tag = {
        id: tagsList.length + 1,
        name: req.body.tags.name.ToLowerCase(),
      };
      tagsList.push(tag);
    }
  } else {
    const basicTag = tagsList.find((b) => b.name === "basic");
    if (basicTag) {
      tag.id = basicTag.id;
      tag.name = basicTag.name;
    }
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

    res.sendStatus(201).send("Note Created");
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

//tags

app.get("/tags", function (req: Request, res: Response) {
  readStorage();
  res.send(tagsList);
});

app.get("/tags/:id", async function (req: Request, res: Response) {
  await readStorage();

  const tag = tagsList.find((a) => a.id === parseInt(req.params.id));
  if (tag) {
    res.status(200).send(tag);
  } else {
    res.status(404).send("Not Found");
  }
});

app.post("/tag", async function (req: Request, res: Response) {
  await readStorage();

  if (req.body.name) {
    const tag: Tag = {
      id: tagsList.length + 1,
      name: req.body.name,
    };
    tagsList.push(tag);
    await updateStorage();
    res.status(201).send("Tag Created");
  }
});

app.put("/tag/:id", async function (req: Request, res: Response) {
  await readStorage();

  const tag = tagsList.find((a) => a.id === parseInt(req.params.id));
  if (!tag) {
    res.status(404).send("Not Found");
  } else {
    const newtag: Tag = {
      id: tag.id,
      name: req.body.name,
    };

    const index = tagsList.indexOf(tag);
    tagsList[index] = newtag;
    await updateStorage();

    res.status(204).send("Updated");
  }
});

app.delete("/tag/:id", async function (req: Request, res: Response) {
  await readStorage();

  const tag = tagsList.find((a) => a.id === parseInt(req.params.id));
  if (!tag) {
    res.status(404).send("Not Found");
  } else {
    const index = tagsList.indexOf(tag);
    tagsList.splice(index, 1);
    await updateStorage();
    res.status(204).send("Deleted");
  }
});

app.listen(3000);
