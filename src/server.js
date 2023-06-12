const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authenticateToken = require('./utils/authenticateToken');

const app = express();
const port = 3000;

const loginRoute = require('./routes/login');
const todosRoutes = require('./routes/todos');

app.use(cors());
app.use(bodyParser.json());

app.use('/todos',authenticateToken , todosRoutes);

app.use('/login', loginRoute);
app.use('/todos',authenticateToken, todosRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
