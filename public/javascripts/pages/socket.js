const socket = io();

// Join chatroom
// socket.emit('joinRoom', { username, room });

// // Get room and users
// socket.on('roomUsers', ({ room, users }) => {
//   outputRoomName(room);
//   outputUsers(users);
// });

// Message from server
socket.on('connect', (message) => {
    console.log('client connect  fgfgf');



});
//   // Emit message to server
//   socket.emit('chatMessage', msg);