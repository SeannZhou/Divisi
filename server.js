const express = require('express');
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require('./config/mongoose');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);
var io = require('socket.io')(server, {cors: {origin: '*'}});

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.use(cors());
app.use('/api/', (req, res, next) => {
    next();
});

mongoose.connect();
mongoose.connection.on('error', function () {
    console.log("Failed to connect to database");
    process.exit(1);
});
mongoose.connection.once('open', function () {
    app.use(passport.initialize());
    require("./config/passport")(passport);
});

const branches = require('./api/routes/branches');
const groups = require('./api/routes/groups');
const mixtapes = require('./api/routes/mixtapes');
const users = require('./api/routes/users');
const apis = require('./api/routes/api');


app.use("/api/branches", branches);
app.use("/api/groups", groups);
app.use("/api/mixtapes", mixtapes);
app.use("/api/users", users);
app.use("/api/", apis);

app.get('/', (req, res) => {
    res.send('ClouDL server up and running.');
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server v8 up and running on port ${port} !`));

io.on('connection', function(socket) {

    console.log(`Client ${socket.id} connected.`);
    socket.on('disconnect', function() {
        console.log('Client disconnected.');
    });
});
