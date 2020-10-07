const express = require("express");

const app = express();

app.use(require("./userRoutes.js"));
app.use(require("./loginRoutes.js"));


module.exports = app