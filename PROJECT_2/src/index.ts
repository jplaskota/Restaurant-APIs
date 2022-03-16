import express from 'express'
import {Request, Response} from 'express'
import { Note } from './note'

const app = express()

const notes: Note[] = []

const addNote = (newNote: Note) => {
    notes.push(newNote)};

app.use(express.json())

app.get('/', function (req: Request, res: Response) {
  res.send('GET Hello World')
})
app.post('/', function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 
  res.status(200).send('POST Hello World')
})
app.post('/note', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    if (title?.trim() || content?.trim()) {
      return res.status(400).send('Title or Content');
    }

    const date = new Date()
    addNote({ title, content, createDate : date.toISOString(), tags : new Array("one", "two", "three"), id : Date.now()});
    res.status(201).send('Note created');
  });

app.listen(3000)