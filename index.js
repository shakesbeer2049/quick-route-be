const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('./middleware/rateLimiter');
require('dotenv').config();
const urlRoute = require('./routes/urlRoutes');
const {connectToDatabase} = require('./connect');
const app = express();


connectToDatabase();
app.use(morgan('dev'));
app.use(express.json());
app.use('/', rateLimiter);
app.use("/", urlRoute);


app.listen(process.env.PORT, () => {
  console.log(`Quick Route BE listening at http://localhost:${process.env.PORT}`);
});