const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('coleslaw.org');
const coleslaw = require('coleslaw');

debug('starting server...');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use('/node_modules', express.static(path.join(__dirname, '..', 'node_modules')));

// Load all of your model definitions
let definitions = [
    require('./models/entry')
];

let pipeline = [
    ['dataAccess', require('coleslaw-dynamo')],
    ['models', require('coleslaw-models')],
    ['routes', require('coleslaw-express')]
];

coleslaw.build(definitions, pipeline, (err, result) => {
    if (err) { throw err; }
    
    console.log(result);
    
    app.use(result.routes); 
    app.listen(8080);
    console.log(`listening on http://localhost:8080`);
});
