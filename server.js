const express = require('express');
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require('./config/mongoose');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
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
    console.log("Connected to database");
    app.use(passport.initialize());
    require("./config/passport")(passport);
});

const users = require('./api/routes/users');
const server = http.createServer(app);

app.use("/api/users", users);

app.get('/', (req, res) => {
    res.send('ClouDL server up and running.');
});

const port = process.env.PORT || 5000;
module.exports = server.listen(port, () => console.log(`Server v8 up and running on port ${port} !`));