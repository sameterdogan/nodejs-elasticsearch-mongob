import app from "./app.js"
import { Server } from "socket.io";
import path from 'path';
const server=app.listen(3000,"0.0.0.0", (err) => {
    if (err) console.log("Server başlatılamadı. " + err);
    console.log("server başarıyla başlatıldı.")
})
global.rootDirect = path.dirname(new URL(import.meta.url).pathname);
global.assetsPath = path.join(global.rootDirect, 'assets');
console.log(global.assetsPath)
global.io = new Server(server,{
    cors: {
        origin: '*',
    }
})

io.on("connection", (socket) => {
    // I'm assuming that you have a username here

/*    console.log(socket.handshake.query.ipAddress)
    socket.join(socket.handshake.query.ipAddress);*/


});
