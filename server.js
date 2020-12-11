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

// create helper middleware so we can reuse server-sent events
const useServerSentEventsMiddleware = (req, res, next) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    // only if you want anyone to access this endpoint
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.flushHeaders();

    const sendEventStreamData = (data) => {
        const sseFormattedResponse = `data: ${JSON.stringify(data)}\n\n`;
        res.write(sseFormattedResponse);
    }

    // we are attaching sendEventStreamData to res, so we can use it later
    Object.assign(res, {
        sendEventStreamData
    });

    next();
}

const streamRandomNumbers = (req, res) => {
    // We are sending anyone who connects to /stream-random-numbers
    // a random number that's encapsulated in an object
    let interval = setInterval(function generateAndSendRandomNumber(){
        const data = {
            value: Math.random(),
        };

        res.sendEventStreamData(data);
    }, 1000);

    // close
    res.on('close', () => {
        clearInterval(interval);
        res.end();
    });
}
app.get('/stream-random-numbers', useServerSentEventsMiddleware,
    streamRandomNumbers)

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

    socket.on('join group', (group, user, activity) => {
        console.log(`socket ${socket.id} requested to join group ${group._id}`);
        socket.broadcast.emit('user join group', user, group, activity);
    });

    socket.on('like track', (activity) => {
        console.log(`socket ${socket.id} liked track ${activity.target.name}`);
        socket.broadcast.emit('user liked track', activity);
    })

    socket.on('message', (msg) => {
        console.log(`${msg} from ${socket.id}`);
        socket.broadcast.emit('pm', msg);
    })

    socket.on('disconnect', function() {
        console.log('Client disconnected.');
        // socket.removeAllListeners('message');
        // socket.removeAllListeners('join group');
        // socket.removeAllListeners('disconnect');
        // io.removeAllListeners('connection');
    });
});
