const express = require('express');
const bodyParser = require('body-parser');
const route = require('./src/routes/route');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDb is connected 👍 😄'))
.catch((err) => console.log('MongoDB connection error:', err));

app.use('/', route);

app.listen(process.env.PORT, function () {
  console.log('Express app running on port', process.env.PORT);
});