module.exports = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (client) => {
        client.emit('new message', 'world');
        client.on('new message', (data) => {
            console.log(data);
        });
    });
}