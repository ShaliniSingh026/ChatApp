const express = require('express');
const http = require('http');
const path = require('path');
//const bodyparser = require('body-parser')
const socketio = require('socket.io');
const { formatMessage, generateLocationMessage} = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const app = express()
//const jQuery = require('jQuery');
//app.use(bodyparser.urlencoded({extended:true}))
const server = http.createServer(app);
const io = socketio(server);
//const publicPath = path.join(__dirname, 'public');
const PORT = process.env.PORT || 4000;
//set static folder
//app.use(express.static(publicPath));
app.use(express.static(path.join(__dirname, './public')));
app.get('',(req,res)=> {
res.sendFile(__dirname + '/public/join.html')
})

const botName = 'Admin';

//After connecting clients
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room}) => {
   const user = userJoin(socket.id, username, room);
  //  console.log(user.room);
    socket.join(user.room);

// For current User
socket.emit('message', formatMessage(botName, 'Welcome to ChatApp!!'));
//To Broadcast a User
socket.broadcast.to(user.room)
.emit('message', formatMessage(botName, `${user.username} has joined the chat`));
 
  // console.log('New connection');
//user & room info to send
io.to(user.room).emit('roomUsers', {
  room: user.room,
  users: getRoomUsers(user.room)
});
});
   //Listen for chatMessage
   socket.on('chatMessage', (msg) => {
     const user = getCurrentUser(socket.id);
     io.to(user.room).emit('message', formatMessage(user.username, msg));
   });

//location
socket.on('location', (coords) => {
  // console.log(coords.latitude);
  const user = getCurrentUser(socket.id);
  io.to(user.room).emit('locationmessage', generateLocationMessage(user.username, coords.latitude, coords.longitude))
});

   //After disconnecting the client
   socket.on('disconnect', () => {
     const user = userLeave(socket.id);
     if(user) {
    io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
//user & room info to send
io.to(user.room).emit('roomUsers', {
  room: user.room,
  users: getRoomUsers(user.room)
      });
    }
 });
})

server.listen(PORT, (res) => { console.log(`Running at Port ${PORT}`) });
