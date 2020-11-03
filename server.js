const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
//const formatMessage = require('./utils/messages');
const { users, userJoin, getCurrentUser, userLeave, getUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

//Runs when client connects
io.on('connection', socket => {
  socket.on('userJoin', username => {
    userJoin(socket.id, username);
    io.emit('docUsers', users)
  });
  socket.on('cursorSend', cursorData => {
    io.emit('showCaret', cursorData)
  })
  //runs when client disconnects 
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
  });
 });

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));