const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

//Runs when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    //wellcome user
    socket.emit('MSG', formatMessage('Admin', 'Welcome to hell!!!'));
    //broadcast when a user connects
    socket.broadcast.to(user.room).emit('MSG', formatMessage('Admin', `${user.username} has joined the chat`));

    //send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
  //listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.emit('MSG', formatMessage(user.username, msg));
  });
  //runs when client disconnects 
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.emit('MSG', formatMessage('Admin', `${user.username} has left the chat`));
    }    

    //send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));