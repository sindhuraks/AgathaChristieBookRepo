const mongoose = require('mongoose');
const books = require('./routes/books');
const express = require('express');
const app = express();

//* check for database connection
mongoose.connect('mongodb://localhost/agatha_christie_repository' , {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());

app.use('/api/books' , books);

//* assign a port
const portNum = process.env.PORT || 2006;
app.listen(portNum,console.log(`Listening on port ${portNum}...`));
