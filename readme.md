![img](image.png)

# Todo App Server

This is a Express.js server for a [Todo application](https://github.com/danielpopek94/task_manager). It provides an API to manage todos with basic CRUD operations.

## Features

- Authentication by JSON Web Token.
- Hashing passwords of new users with bcrypt.
- Fetch todos based on the `userId` query parameter.
- Create a new todo with the `POST /todos` endpoint.
- Update a todo with the `PATCH /todos/:id` endpoint.
- Delete a todo with the `DELETE /todos/:id` endpoint.
- Automatic server refresh with Nodemon.

## Technologies Used

- Node.js
- Express.js
- MongoDB (Atlas)
- JWT
- Nodemon
- Cors
- Body Parser

## Getting Started

1. Let's fork repository.
2. Clone the repository: `git clone https://github.com/your-username/todos_backend.git`
3. Navigate to the project directory: `cd todo-app-server`
4. Install the dependencies: `npm install`
5. Start the server: `npm start`

The server will be running on `http://localhost:3000`.

## API Endpoints

### POST /login

Searches for a user in the database based on the input data in the body. If successful, it generates and returns a JWT.

Example: `POST /login`.

### Post /register

Searches for a user in the database based on the input data in the body. If there is no user in the database, it creates a new user and returns JWT (automatic login).

Example: `POST /register`.

### GET /todos

Fetches todos based on the JWT in localStorage.

Example: `GET /todos`

### POST /todos

Creates a new todo.

Example: `POST /todos`

Request Body:
```json
{
  "userId": 123,
  "title": "Some cool task",
  "completed": false
}
```

### PATCH /todos/:id

Updates a todo with the specified `id`.

Example: `PATCH /todos/456`

Request Body:
```json
{
  "title": "Updated cool task",
  "completed": true
}
```

### DELETE /todos/:id

Deletes a todo with the specified `id`.

Example: `DELETE /todos/789`

## Notes

- The server uses MongoDB as the database to store todos.
- The server automatically sets the `createdAt` field when a todo is created and updates the `updatedAt` field when a todo is updated.
- Also the server automatically sets `id` when creating a todo.

Feel free to explore the code and customize it according to your requirements.

## Deployment

U can use [Render.com](https://render.com/) for deployment.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
