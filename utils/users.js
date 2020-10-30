const users = [];

// join user to chat 
function userJoin(id, username) {
  const user = { id, username };

  users.push(user);

  return user;
}

//get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

//user leaves chat 
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//get doc users
function getUsers() {
  return users;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getUsers
};