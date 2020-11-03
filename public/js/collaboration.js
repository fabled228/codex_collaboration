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
})

socket.on('showCaret', ({caretPos, username, parentIndex, textIndex, id, key}) =>{
  const caret = document.getElementById(id);
  const usedParagraph = main.children[parentIndex];
  const textNodes = [...usedParagraph.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE && node.parentNode === usedParagraph)
  const textNode = textNodes[textIndex];


  if (key) {
    if (id !== socket.id) {
      if (key === 'Backspace') {
        textNode.textContent = textNode.textContent.substring(0, textNode.textContent.length - 1)
      } else {
        textNode.textContent += key;
      }
    }
  }

  const replacement = textNode.splitText(caretPos);
  const div = document.createElement('div');
  const userNameLabel = document.createElement('span');
  userNameLabel.contentEditable = false;
  div.contentEditable = false;
  userNameLabel.className = "userLabel";
  userNameLabel.textContent = username;
  div.className = "caret";
  div.id = id;
  div.appendChild(userNameLabel);
  replacement.before(div);

  if (caret){
    caret.remove();
    usedParagraph.normalize();
  }
})

function onContentEditableChange(event) {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  const caretPos = range.endOffset;
  const textNode = range.endContainer;
  const parent = textNode.parentElement;
  const textIndexs = [...parent.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE && node.parentNode === parent)
  const textIndex = textIndexs.indexOf(textNode);
  const parentIndex = [...main.children].indexOf(parent);

  let key;

  if ((event.keyCode >= 48 && event.keyCode <= 90 || event.keyCode === 8 || event.keyCode === 32) && !event.metaKey) {
    key = event.key;
  }

  socket.emit('cursorSend', {caretPos, username, parentIndex, textIndex , id: socket.id, key });
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
