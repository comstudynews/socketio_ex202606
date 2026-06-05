// 별도의 모듈로 만든다.
module.exports = function(server) {
    const { Server } = require('socket.io');
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.sockets.on('connection', function(socket) {
        console.log('connection ... ');
        
        io.sockets.emit('this', {will:'be received by everyone'});
        
        socket.on('private  message', function(from, msg) {
            console.log('I received a private message by', from, 'saying', msg);
        });
        
        socket.on('disconnect', function() {
            io.sockets.emit('user disconnected');
        });
    });
}