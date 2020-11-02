const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users-list');
//get username and room from url

const { username } = Object.fromEntries(new URLSearchParams(location.search));

const socket = io();

//join document
socket.emit('userJoin', username)

//add users to list
socket.on('docUsers', users => {
  outputUsers(users);
})

// //message from server
// socket.on('MSG', message => {
//   console.log(message);
//   outputMessage(message);

//   //scroll down
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// });

// //message submit
// chatForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   //get message text
//   const msg = e.target.elements.msg.value;

//   //emit message to server
//   socket.emit('chatMessage', msg);

//   //clear input
//   e.target.elements.msg.value = '';
//   e.target.elements.msg.focus();

// });

// //output message to DOM
// function outputMessage(message) {
//   const div = document.createElement('div');
//   div.classList.add('message');
//   div.innerHTML = `	<p class="meta">${message.username} <span>${message.time}</span></p>
//   <p class="text">
//     ${message.text}
//   </p>`;
//   document.querySelector('.chat-messages').appendChild(div);
//}

//add users to DOM
function outputUsers(users){
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}