const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

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

/**
 * Midddlewares
 * @author Jamie Omondi
 * @since 19-04-2023
 */
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.text({ type: ['text/html', 'text/plain'] }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);

mongoose.connection.once("open", () => {
    console.log("INFO: Connected to MongoDB".green);
    app.listen(port, () => console.log(`INFO: Server running on port ${port}`.green));
});

mongoose.connection.on("error", error => {
    console.log(`ERROR: ${error}`.red);
});

mongoose.connection.on("disconnected", () => console.log("Diconnected from database".yellow));

mongoose.connection.on("reconnected", () => {
    console.log("Reconnected to ddatabase".green)
});