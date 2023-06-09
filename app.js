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

    const db = client.db(dbName);
    const todo = await db.collection('todos').find().toArray();

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

app.post('/todos', async (req, res) => {
  try {
    const {userId, title, completed} = req.query;
    const client = new MongoClient(mongoUrl);

    await client.connect();

    const db = client.db(dbName);
    const result = await db.collection('todos').insertOne({
      "userId": userId,
      "title": title,
      "completed": completed
    });
    const insertedId = result.insertedId; // Pobierz pierwsze utworzone todo z result.ops
    const insertedTodo = await db.collection('todos').findOne({ "_id": insertedId }); // Pobierz todo na podstawie identyfikatora

    res.json(insertedTodo);
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
