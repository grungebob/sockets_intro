const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = {};
io.on('connection', socket => {
  socket.on('userConnect', username => {
    if(username)io.emit('chatMessage', {username, msg: ' has connected', users});
    if(username) users[socket.id] = username;
  })
  socket.on('chat message', (username, msg) => {
    io.sockets.in(socket.room).emit('chatMessage', {username, msg});
  })
  socket.on('userDisconnect', username  => {
    if(username)io.emit('chatMessage', {username, msg: ' has connected'}); 
  });

  socket.on('isTyping', username => {
    io.emit('isTyping', username);
  })

  socket.on('pingServer', console.log)

  socket.on('join room', (data) => {
    console.log('joining room ', data.room);
    socket.room = data.room;
    socket.join(data.room);
  })

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
