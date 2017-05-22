const
    express = require('express'),
    app = express(),
    body_parser = require('body-parser'),
    rn = require('random-number'),
    pokemonList = [
        'pikachu',
        'squirtle',
        'charazard',
        'coffing'
    ],
    randEl = arr => arr[rn({min: 0, max: arr.length - 1, integer: true})]

app.use(express.static('public'))  
app.set('view engine', 'pug')
app.use(body_parser.urlencoded({extended: false}))  
app.use(body_parser.json())

app.get('/', (req, res) => res.render('index'))
app.post('/message', (req, res) => res.json({response: `message was "${req.body.data.message}"`}))
app.get('/pokemon', (req, res) => res.json({pokemon: `your pokemon is ${randEl(pokemonList)}`}))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
