const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const path = require('path');
const socketio = require('socket.io');
const port = 8080
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')))

// socket.io 
io.on('connection', (socket) => {
    console.log(`user connected with id : ${socket.id}`);

    // socket joining a room
    socket.on('join', roomId => {
        socket.join(roomId)
        console.log(`user joined the room with id : ${roomId}`)
    });


    socket.on('sendMessage', (data) => {
        socket.broadcast.to(data.roomId).emit('message', data);
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
}); 


// express routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'))
});


// listen
server.listen(port , () => {
    console.log(`Server is running on port ${port}`)
});