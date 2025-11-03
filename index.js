const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

let players = {};

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);
    players[socket.id] = { id: socket.id, x:0, z:0 };

    socket.on('playerMove', data => {
        players[socket.id] = data;
        socket.broadcast.emit('playerUpdate', players);
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        delete players[socket.id];
        socket.broadcast.emit('playerUpdate', players);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
