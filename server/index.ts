const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('coleslaw.org');
const app = express();

debug('starting server...');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use('/node_modules', express.static(path.join(__dirname, '..', 'node_modules')));

app.listen(8080);
console.log(`listening on http://localhost:8080`);
