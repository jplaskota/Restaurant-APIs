import express from 'express'
import {Request, Response} from 'express'
import { parse } from 'path'
import { Note } from './note'

const app = express()

app.use(express.json())

app.get('/', function (req: Request, res: Response) {
  res.send('GET Hello World')
})

app.post('/', function (req: Request, res: Response) {
  console.log(req.body) // e.x. req.body.title 
  res.status(200).send('POST Hello World')
})

const notes: Note[] = [
  {title: 'a', content: 'one', createDate: "1-01-2022", tags: ['a','b','c'], id: 1 },
  {title: 'b', content: 'two', createDate: "2-02-2022", tags: ['a','c'], id: 2 }
]

function addNote(newNote: Note){
  notes.push(newNote)
}

function search(a: number){
  for(const item of notes){
    if(item.id === a){
      return true
    }
  }
  return false
}

app.get('/note/:id', function (req: Request, res: Response) {
  const ID = parseInt(req.params.id)
  if(search(ID)){
    res.status(201).send(notes.find(a => a.id === ID))
  }
  else{
    res.status(404).send("not found")
  }
})

// do zrobienia
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