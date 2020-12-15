const express = require('express');
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require('./config/mongoose');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {cors: {origin: '*'}});

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.use(cors());
// app.use('/api/', (req, res, next) => {
//     next();
// });

app.use('/test', (req, res) => res.send("it's working!!"));

mongoose.connect();
mongoose.connection.on('error', function () {
    console.log("Failed to connect to database");
    process.exit(1);
});
mongoose.connection.once('open', function () {
    app.use(passport.initialize());
    require("./config/passport")(passport);
});

const comments = require('./api/routes/comments');
const branches = require('./api/routes/branches');
const groups = require('./api/routes/groups');
const mixtapes = require('./api/routes/mixtapes');
const users = require('./api/routes/users');
const apis = require('./api/routes/api');

app.use("/comments", comments);
app.use("/branches", branches);
app.use("/groups", groups);
app.use("/mixtapes", mixtapes);
app.use("/users", users);
app.use("/", apis);


const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server v8 up and running on port ${port} !`));

io.on('connection', function(socket) {

    console.log(`Client ${socket.id} connected.`);

    socket.on('join group', (activity) => {
        console.log("===============================")
        console.log(activity)
        // console.log(`socket ${socket.id} requested to join group ${activity.target._id}`);
        socket.broadcast.emit('user join group', activity);
    });

    socket.on('like track', (activity) => {
        console.log("===============================")
        console.log(activity);
        // console.log(`socket ${socket.id} liked track ${activity.target.name}`);
        socket.broadcast.emit('user liked track', activity);
    })

    socket.on('message', (msg) => {
        console.log(`${socket.id}: ${msg}`);
        socket.emit('pm', msg);
    })

    socket.on('disconnect', function() {
        console.log('Client disconnected.');
        // socket.removeAllListeners('message');
        // socket.removeAllListeners('join group');
        // socket.removeAllListeners('disconnect');
        // io.removeAllListeners('connection');
    });
});
