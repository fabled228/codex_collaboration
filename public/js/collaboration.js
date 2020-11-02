const events = ["mouseup", "keyup"]
const currentPosShow = document.getElementById("caretposition");
const userList = document.getElementById('users-list');
const main = document.getElementById("main");
document.execCommand("defaultParagraphSeparator", false, "p");
//get username and room from url
const { username } = Object.fromEntries(new URLSearchParams(location.search));

const socket = io();
//join document
socket.emit('userJoin', username)

//add users to list
socket.on('docUsers', users => {
  outputUsers(users);
  console.log(users);
  console.log('zxc');
})

socket.on('showCaret', ({caretPos, username, parentIndex, textIndex, id}) =>{
  console.log(id);
  const caret = document.getElementById(id);
  const usedParagraph = main.children[parentIndex];
  const textNodes = [...usedParagraph.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE && node.parentNode === usedParagraph)
  const textNode = textNodes[textIndex];
  const replacement = textNode.splitText(caretPos);
  if (caret){
    caret.remove();
    usedParagraph.normalize();
  }
  const div = document.createElement('div');
  const userNameLabel = document.createElement('span');
  userNameLabel.contentEditable = false;
  div.contentEditable = false;
  userNameLabel.id = "userLabel";
  userNameLabel.textContent = username;
  div.className = "caret";
  div.id = id;
  console.log(replacement);
  console.dir(replacement);
  div.appendChild(userNameLabel);
  replacement.before(div);
  console.log(div);
})

function onContentEditableChange() {
  const sel= window.getSelection();
  const range = sel.getRangeAt(0);
  const caretPos = range.endOffset;
  const textNode = range.endContainer;
  const parent = textNode.parentElement;
  const textIndexs = [...parent.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE && node.parentNode === parent)
  const textIndex = textIndexs.indexOf(textNode);
  const parentIndex = [...main.children].indexOf(parent);
  // sending cursor pos everybody
  socket.emit('cursorSend', {caretPos, username, parentIndex, textIndex , id: socket.id});
  currentPosShow.textContent = caretPos;
}

events.forEach(event => {
  main.addEventListener(event, onContentEditableChange);
})

function outputUsers(users){
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}