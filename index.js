const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const consola = require('consola');

require('dotenv').config();
require('./routes')(app, io, {});

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

http.listen(port, function() {
    consola.start('App listening on port ' + port);

    if(process.env.HEROKU) {
        consola.start('Running on Heroku. Ready..');
    } else {
        consola.start('Running locally. Ready..');
    }

});
