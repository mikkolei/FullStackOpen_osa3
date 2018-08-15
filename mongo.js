const mongoose = require('mongoose')

const url = 'mongodb://kayttaja:salasana@ds219832.mlab.com:19832/fullstack-phonebook'

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 4) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    person
        .save()
        .then(result => {
            console.log(`lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} tietokantaan`)
            mongoose.connection.close()
        })
} else {
    Person
        .find({})
        .then(result => {
            console.log('puhelinluettelo:')
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()    
        })
}