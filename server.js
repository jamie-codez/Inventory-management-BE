const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
require('colors');

const app = express();
const port = process.env.PORT || 9001;

mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.text({ type: ['text/html', 'text/plain'] }));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connection.once("open", () => {
    console.log("INFO: Connected to MongoDB".green);
    app.listen(port, () => console.log(`INFO: Server running on port ${port}`));
});

mongoose.connection.on("error", error => {
    console.log(`ERROR: ${error}`.red);
});

mongoose.connection.on("disconnected", () => console.log("Diconnected from database".yellow));

mongoose.connection.on("reconnected", () => {
    console.log("Reconnected to ddatabase".green)
});