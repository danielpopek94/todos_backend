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

    const checkUser = await db.collection('users').findOne({ email: email });

    if (checkUser) {
      return res.status(409).json({ error: 'User with this email already exists!' });
    }

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      "createdAt": new Date(),
    });

		const token = jwt.sign({ userId: newUser.insertedId }, jwt_secret, { expiresIn: '1h' });

    const result = await db.collection('users').updateOne(
      { "email": email },
      { $set: {token}}
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