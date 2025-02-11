export default (socket) => {
    console.log(`client ${socket.id} has connected`);
    socket.emit('welcome', 'welcome to the server');
}