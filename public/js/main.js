const mainForm = document.getElementById('chat-form');
const chatMesaages = document.querySelector('.chat-messages');

const socket = io();

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('joinChat', { username, room });
socket.on('roomUsers', ({users, room}) => {
    const usersList = document.getElementById('users');
    const roomName = document.getElementById('room-name');
    roomName.innerText = room;

    usersList.innerHTML = '';
    users.forEach(user => {
        const liTag = document.createElement('li');
        liTag.innerText = user.username;

        usersList.append(liTag);
    });
});

socket.on('message', message => {
    outputMessage(message);

    chatMesaages.scrollTop = chatMesaages.scrollHeight;
});

mainForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.elements.msg.value;

    socket.emit('chatMessage', message);
    
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.username}
            <span>${message.date}</span>
        </p>
        <p class="text">
            ${message.text}
        </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });