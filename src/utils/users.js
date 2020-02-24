const users = [];

// addUser, removeUser, getUser, getUsersInRomm

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required!"
    };
  }

  // Check for existing user
  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: "Username is in use..."
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0]; // the second argument is how many to remove
  }
};

const getUser = id => {
  const searchUser = users.find(user => user.id === id);

  if (!searchUser) {
    return undefined;
  }

  return searchUser;
};

const getUsersInRomm = room => {
  const roomUsers = users.filter(user => user.room === room);

  return roomUsers;
};

addUser({
  id: 22,
  username: "Gautier",
  room: "Paris"
});

console.log(users);

// const removedUser = removeUser(22);

// console.log(removedUser);
// console.log(users);

const user = getUser(22);

console.log(user);

const paris = getUsersInRomm("paris");
const melun = getUsersInRomm("melun");

console.log(paris);
console.log(melun);
