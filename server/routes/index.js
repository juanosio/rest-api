const express = require("express");

const app = express();

app.use(require("./categoryRoutes.js"));
app.use(require("./productRoutes.js"));
app.use(require("./userRoutes.js"));
app.use(require("./loginRoutes.js"));


module.exports = app