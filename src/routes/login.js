const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const router = express.Router();

require('dotenv').config();
const userId = process.env.USER_ID;
const passwordDB = process.env.USER_PASSWORD;
const jwt_secret = process.env.JWT_SECRET;

const dbName = 'TodoApp';
const mongoUrl = `mongodb+srv://${userId}:${passwordDB}@todos.aui5rsa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(mongoUrl);

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = new MongoClient(mongoUrl);

    await client.connect();

    const db = client.db(dbName);

    const user = await db.collection('users').findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    const isPasswordValid = user && await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, jwt_secret, {
      expiresIn: "168h",
    });

    const result = await db.collection('users').updateOne(
      { "email": email },
      { $set: {token}
      }
    );

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