const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

require('dotenv').config();
const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', socket => {
    // Emit to user when connects (Just send to user that connected)
    socket.emit('message', 'Welcome to chat!');

    // Brodcast when a user connects (send to all user exept that user connected)
    socket.broadcast.emit('message', 'A user has joined the chat!');

    // Brodcast when a user disconencts from chat
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });
});

server.listen(PORT, () => console.log(
    `http://localhost:${PORT}`
));