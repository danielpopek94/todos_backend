const convertTodo = (todo) => {
  const _id = todo._id;
  const newTodo = {
    ...todo,
    id: _id.valueOf(),
  }

  delete newTodo._id;

  return newTodo
}

module.exports = {
  convertTodo,
};