const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const { convertTodo } = require('../utils/convertTodo');
const userId = process.env.USER_ID;
const password = process.env.USER_PASSWORD;
const router = express.Router();
const dbName = 'todo';
const mongoUrl = `mongodb+srv://${userId}:${password}@todoapp.bbycyl2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(mongoUrl);

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = new MongoClient(mongoUrl);

    await client.connect();

    const db = client.db(dbName);

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    const isPasswordValid = user && await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, 'secret-key', { expiresIn: '1h' });

    res.json({ token });
  } catch (e) {
    console.log('Error, cannot connect to the database:', e);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
});

module.exports = router;