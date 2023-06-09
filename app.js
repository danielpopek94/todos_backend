const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const dbName = 'todo';
const mongoUrl = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(mongoUrl);


app.get('/todos', async (req, res) => {
  try {
    const userId = req.query.userId;

    const client = new MongoClient(mongoUrl);
    await client.connect();
    console.log('Database connection is ok!');

    const db = client.db(dbName);

    const todo = await db.collection('todos').find().toArray();;

    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (e) {
    console.log('Error, cannot connect to the database:', e);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
