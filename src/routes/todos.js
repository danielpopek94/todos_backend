const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const { convertTodo } = require('../utils/convertTodo');

const router = express.Router();
const dbName = 'todo';
const mongoUrl = 'mongodb+srv://admin:admin@todoapp.bbycyl2.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(mongoUrl);


router.get('/', async (req, res) => {
  try {
    if (!req.query.userId) {
      res.json('NO USER_ID');
    } else {
      const userId = Number(req.query.userId);
      const client = new MongoClient(mongoUrl);

      await client.connect();

      const db = client.db(dbName);

      const todos = await db.collection('todos').find({"userId": userId}).toArray();

      if (todos.length) {
        res.json(todos.map(todo => convertTodo(todo)));
      } else {
        res.json(userId);
      }
    }
  } catch (e) {
    console.log('Error, cannot connect to the database:', e);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    const client = new MongoClient(mongoUrl);
    const {title, completed} = req.body;

    await client.connect();

    const db = client.db(dbName);
    const result = await db.collection('todos').insertOne({
      "userId": Number(userId),
      "title": title,
      "completed": completed,
      "createdAt": new Date(),
    });
    const insertedId = result.insertedId;
    const insertedTodo = await db.collection('todos').findOne({ "_id": insertedId });

    res.json(convertTodo(insertedTodo));
  } catch (e) {
    console.log('Error, cannot connect to the database:', e);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id =  req.params;
    const objectId = new ObjectId(id);
    const client = new MongoClient(mongoUrl);

    await client.connect();

    const db = client.db(dbName);
    const updateFields = {};
    
    for (const key in req.body) {
      if (req.body[key] !== null) {
        updateFields[key] = req.body[key];
      }
    }

    const result = await db.collection('todos').updateOne(
      { "_id": objectId },
      { $set: {
          ...updateFields,
          updatedAt: new Date(),
        }
      }
    );

    if (result.modifiedCount === 1) {
      const updatedTodo = await db.collection('todos').findOne({ "_id": objectId });
      res.json(convertTodo(updatedTodo));
    } else {
      res.status(404).json({ error: 'Task not found or no changes made' });
    }
  } catch (e) {
    console.log('Error, cannot connect to the database:', e);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id =  req.params;
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


module.exports = router;