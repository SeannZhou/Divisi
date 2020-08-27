const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.use(cors());

const users = require('../api/routes/users');
app.use("/api/users", users);

module.exports = app;
