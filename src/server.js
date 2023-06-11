const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const dbName = 'todo';
const mongoUrl = 'mongodb+srv://admin:admin@todoapp.bbycyl2.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(mongoUrl);

app.use(cors());
app.use(bodyParser.json());

const todosRoutes = require('./routes/todos');

app.use('/todos', todosRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
