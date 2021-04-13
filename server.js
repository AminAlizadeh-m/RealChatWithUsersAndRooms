const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/formatMessage');
const { userJoin, getCurrentUser, userLeave, getUserRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

require('dotenv').config();
const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'MyChatRoomBot';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinChat', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Emit to user when connects (Just send to user that connected)
        socket.emit('message', formatMessage(botName, 'Welcome to chat!'));

        // Brodcast when a user connects (send to all user exept that user connected)
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${username} has joined the chat!`));

        // Brodcast when a user disconencts from chat
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
        });
    });

    socket.on('chatMessage', message => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username , message));
    });
});

server.listen(PORT, () => console.log(
    `http://localhost:${PORT}`
));