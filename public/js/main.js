const chatForma = document.getElementById('chat-form'); // вытаскиваем из дома форму с инпутом, который является основным вводом текста
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io(); // мы можем так делать, т.к. подключили это в скрипте хтмл, // подключаем 

// get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true, // for ignore % = ? and else
});
// const { username, room } = можно было через req.query достать в ручке и объявить их через рес локалс?

// join Chatroom
socket.emit('joinRoom',{ username, room })

//m get room and users

socket.on('roomUsers',({room,users}) =>{
  outputRoomName(room);
  outputUsers(users);

})

// message from server
socket.on('message', mess => { // socket ловим из файла сервер, через эмитт 
  // console.log(mess); // mess => Dratuti to Elbrus
  outputMessage(mess);

  // scroll down when new mes
  chatMessages.scrollTop = chatMessages.scrollHeight; // scrollTop вертикальный скроллинг, есть еще горизонтальный
});

// message submit
chatForma.addEventListener('submit', (e) => {
  e.preventDefault();

  const mesaga = e.target.elements.msg.value; // msg это айди инпута, elements -> это инпут и баттон, они есть в доме формы , т.е. получаем сам текст сообщения
  // console.log('>>>>',mesaga);

  // отправляем сообщение на сервер
  socket.emit('chatMessage', mesaga);
  // cleat input;
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus(); // CHECK IT LATER https://learn.javascript.ru/focus-blur
  //События focus/blur  => Событие focus вызывается в момент фокусировки, а blur – когда элемент теряет фокус.

})

//output message from dom
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message'); // classList дает все классы , add class of message (он есть у дива в чатюхтмл)
  div.innerHTML = ` <p class="meta"> ${message.username} <span>${message.time}</span> </p>
  <p class="text"> ${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// add room name to DOM
function outputRoomName(room) {
  roomName.innerHTML = ` <i class="fas fa-home"></i> ${room} `; // тут одно значение, поэтому иннер текст
}


// add users to DOM 
function outputUsers(users){ // тут массив, поэтому придется изголяться
  
  let ind = randomIcon(iconArr)
  
  userList.innerHTML = ` 
  ${users.map(elem => ` <li> ${ind}  ${elem.username}</li>`).join('')}
  `; // для каждого элемента массива юзерс выводим лишкой и добавляем строкой
}

let iconArr = [
  '<i class="fas fa-award"></i>',
  '<i class="fab fa-accessible-icon"></i>',
  '<i class="fas fa-paw"></i>',
'<i class="fas fa-apple-alt"></i>',
'<i class="fas fa-carrot"></i>',
'<i class="fas fa-dove"></i>',
'<i class="fas fa-dragon"></i>',
];

function randomIcon(iconArr){
  let icon = Math.floor(Math.random()*7+1)
  return iconArr[icon];
}
