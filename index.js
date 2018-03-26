const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('dotenv').config();
require('./routes')(app, io, {});

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

http.listen(port, function() {
    console.log('App listening on port ' + port);

    if(process.env.HEROKU) {
        console.log('Running on Heroku. Ready..');
    } else {
        console.log('Running locally. Ready..');
    }

});
