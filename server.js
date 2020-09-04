const http = require('http');
const express = require('express');
const socketio = require('socket.io'); // подключаем сокет айо , это не только веб сокеты, но и небольшая надстройка над ними. Вообще это библиотека JS 
const app = express();
const path = require('path');
const server = http.createServer(app);
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');



// добавляем статику, чтобы видеть папку паблик
app.use(express.static(path.join(__dirname, 'public')));

// что то типо системного обозначения,как безымянный автор за кадром))
const botname = 'the Admin';


const io = socketio(server); // подключаем к айо сервер 

io.on('connection', socket => { // первая строка это событие , на которое срабатывает айо // socket это параметр кол бека, можно называть как хошь, но это устоявшееся, как я понял
  console.log(`Новое соединение с Веб сервером`); // так работает сокет, постоянно реагирует на связь с сервером

  socket.on('joinRoom', ({ username, room }) => { // 2 Emita перетащили, т.к. евент джоин рум для них одинаков

    const user = userJoin(socket.id, username, room);

    socket.join(user.room); // метод у айо, позволяет подключать в разные комнаты

    socket.emit('message', formatMessage(botname, 'Dratuti to Elbrus ')); // мы можем называть message как угодно и вторую строку тоже
    // io.emit() => broadcast для всех 

    // broadcast when a user connects // to() send message to a current room
    socket.broadcast.to(user.room).emit('message', formatMessage(botname, `Пользователь ${user.username} вошел в чат`)); // broadcast это сообщение для всех , кроме самого пользователя

    // send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    })
  })

  // listen for chatMessage
  socket.on('chatMessage', (mesaga) => {
    const user = getCurrentUser(socket.id) // находим юзера по айди сокета 
    io.to(user.room).emit('message', formatMessage(user.username, mesaga)); // `${user.username}`
  })
  // runs when client disconn
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) { // form userLeave we get user that gone away from chat
      io.to(user.room).emit('message', formatMessage(botname, `Пользователь ${user.username} покинул чат`))

      // send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      })
    }

  });
})



const PORT = process.env.PORT || 80

server.listen(PORT, () => {
  console.log(` i am on port ${PORT}`)
})
