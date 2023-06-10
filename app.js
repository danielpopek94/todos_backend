const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const app = express();
const port = 3000;

const dbName = 'todo';
const mongoUrl = 'mongodb+srv://admin:admin@todoapp.bbycyl2.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(mongoUrl);

app.get('/todos', async (req, res) => {
  try {
    const userId = req.query.userId;
    const client = new MongoClient(mongoUrl);

    await client.connect();

    const db = client.db(dbName);

    const todo = await db.collection('todos').find().toArray();//fixed toArray after tests

    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
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
    const insertedId = result.insertedId;
    const insertedTodo = await db.collection('todos').findOne({ "_id": insertedId });

    res.json(insertedTodo);
  } catch (e) {
    console.log('Error, cannot connect to the database:', e);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
});

app.delete('/todos', async (req, res) => {
  try {
    const id = req.query.id;
    const objectId = new ObjectId(id);
    const client = new MongoClient(mongoUrl);

    await client.connect();

    const db = client.db(dbName);
    const result = await db.collection('todos').deleteOne({ "_id": objectId });

    if (result.deletedCount === 1) {
      res.json({ message: 'Todo deleted successfully' });
    } else {
      res.status(404).json({ error: 'Todo not found' });
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
