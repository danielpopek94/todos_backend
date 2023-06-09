const { todos } = require('./todos.cjs')
const express = require('express')
const app = express()
const port = 3000

app.get('/todos', (req, res) => {
  const userId = req.query.userId;
  
  const usersTodos = todos.filter(task => task.userId === Number(userId));
  console.log(usersTodos);
  res.send(usersTodos);
})

app.post('/todos', (req, res) => {
  res.send('Got a POST request')
})

app.put('/todos', (req, res) => {
  res.send('Got a PUT request')
})

app.delete('/todos', (req, res) => {
  res.send('Got a DELETE request')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})