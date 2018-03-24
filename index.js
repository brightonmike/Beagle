const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const psi = require('psi');
const port = process.env.PORT || 5000;
const path = require('path')
const validUrl = require('valid-url');

require('./routes')(app, {});

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(port, function() {
    console.log('App listening on port ' + port);
});
