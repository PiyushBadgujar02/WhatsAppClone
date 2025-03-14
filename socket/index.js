import {Server} from 'socket.io'

const io = new Server(9000, {
    cors: {
        origin: ['http://localhost:3000', 'https://client-pi-mauve.vercel.app'],
    }, 
})

let users = [];

const addUser = (userData, socketId) => {
    !users.some(user => user.sub === userData.sub) && users.push({ ...userData, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    console.log(users)
    return users.find(user => user.sub === userId);
}

io.on('connection',(socket)=>{
    console.log('user connected')


    socket.on("addUser", userData => {
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    })

    socket.on('sendMessage',data=>{
        const user = getUser(data.receiverId)
        console.log(user)
        io.to(user.socketId).emit('getMessage',data)
    })

    socket.on('sendMessage', (data) => {
        const user = getUser(data.receiverId);
        io.to(user.socketId).emit('getMessage', data)
    })
})