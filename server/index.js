const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const debug = require('debug')('coleslaw.org')
const coleslaw = require('coleslaw')

debug('starting server...')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Load all of your model definitions
let definitions = [
  require('./models/entry')
]

let pipeline = [
  require('coleslaw-dynamo'),
  require('coleslaw-models'),
  require('coleslaw-express')
]

coleslaw.build(definitions, pipeline, (err, result) => {
  if (err) throw err

  app.use('/', express.static(path.join(__dirname, '..', 'app')))
  app.use('/api', result.routes)
  app.listen(8080)

  console.log('listening on http://localhost:8080')
})
