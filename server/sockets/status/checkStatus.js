let checkStatus = (socket, clients, user) => {
  let listUserOnline = Object.keys(clients);
  // Step 1: Emit to user after login or F5 web page
  socket.emit("server-send-list-users-online", listUserOnline);
  // Step 2: Emit to all another users when has new user Online
  socket.broadcast.emit("server-send-when-new-user-online", user._id);
};

module.exports = checkStatus;
