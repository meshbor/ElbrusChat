// Here will be everything that would gonna be with users

const users = []; // maybe we should use database later?

// join user to chat 
function userJoin(id, username, room) {
  const user = { id, username, room }
  users.push(user);
  return user;

}

// get the current user 
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// user leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id); // находим индекс юзера по айди

  if (index !== -1) {
    return users.splice(index, 1)[0] // вырезаем юзера из массива при выходе // индекс нулевой это первый элемент массива, т.к. нам нужно вернуть один элемент а не массив
  }
}

// get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room)

}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,

};

