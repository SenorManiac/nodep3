const express = require('express');
const path = require('path');
const app = express();
const existingEnv = { ...process.env };
require('dotenv').config();
process.env = { ...process.env, ...existingEnv }
const PORT = 3000;
const assetsPath = path.join(__dirname, "public");
const indexRouter = require('./routes/index');
;

app.use(express.static(assetsPath));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.use((req, res, next) => {
    console.log(`App Handling: ${req.method} ${req.url}`);
    next();
});




app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);



module.exports = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};