const socket = io();

// Join chatroom
// socket.emit('joinRoom', { username, room });

// // Get room and users
// socket.on('roomUsers', ({ room, users }) => {
//   outputRoomName(room);
//   outputUsers(users);
// });

// Message from server
const client = socket.connect('localhost:3000');
client.on('new message', (response) => {
    console.log(response);
});

client.emit('new message', 'client to server');
// socket.on('connect', (message) => {
//     console.log('client connect  fgfgf');



// });
//   // Emit message to server
//   socket.emit('chatMessage', msg);