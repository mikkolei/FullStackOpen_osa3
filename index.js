const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

morgan.token('type', (req, res) => { 
    return JSON.stringify(req.body) 
})

let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    },
    {
        name: 'Martti Tienari',
        number: '040-123456',
        id: 2
    },
    {
        name: 'Arto Järvinen',
        number: '040-123456',
        id: 3
    },
    {
        name: 'Lea Kutvonen',
        number: '040-123456',
        id: 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const numberOfPersons = persons.length
    const date = new Date()
    res.send(`<p>puhelinluettelossa ${ numberOfPersons } henkilön tiedot</p>
              <p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
  
    if ( person ) {
      res.json(person)
    } else {
      res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
  
    res.status(204).end()
})

const generateId = () => {
    let randomId = Math.floor(Math.random() * 99999)
    return randomId
}

app.post('/api/persons', (req, res) => {
    const body = req.body
  
    if (body.name === undefined || body.number === undefined) {
      return res.status(400).json({error: 'name or number missing'})
    }

    const names = persons.map(p => p.name)
    if (names.includes(body.name)) {
        return res.status(400).json({error: 'name must be unique'})
    }
  
    const newPerson = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
  
    persons = persons.concat(newPerson)
  
    res.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})