const convertTodo = (element) => {
  const _id = element._id;
  const newElement = {
    ...element,
    id: _id.valueOf(),
  }

  delete newElement._id;

  return newElement
}

module.exports = {
  convertTodo,
};