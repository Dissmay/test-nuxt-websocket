const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const users = require("./users")();
const fs = require("fs");
const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf8");
const { uuid } = require("uuidv4");
let encode = require("image-encode");

const m = (name, text, id, uuid, img) => ({ name, text, id, uuid, img });

io.on("connection", socket => {
    socket.on("userJoined", (data, cb) => {
        if (!data.name || !data.room) {
            return cb("Данные некорректны");
        }

        socket.join(data.room);
        const adminNamespace = io.sockets.adapter.rooms[data.room].sockets;

        console.log(io.sockets.adapter.rooms, 'io.sockets.adapter.rooms');
        console.log("socketId", socket.id);

        users.remove(socket.id);
        users.add({
            id: socket.id,
            name: data.name,
            room: data.room
        });

        cb({ userId: socket.id });
        io.to(data.room).emit("updateUsers", users.getByRoom(data.room));
        socket.emit("newMessage", m("admin", `Добро пожаловать ${data.name}.`));
        // socket.emit('newMessage', m('', `ЛОЛ ТЕСТ`, data.id))
        // io.emit('newMessage', m('admin', users.usersLength()))

        // socket.broadcast - всем кроме отправителя придет сообщение
        socket.broadcast
            .to(data.room)
            .emit("newMessage", m("admin", `Пользователь ${data.name} зашел.`));
    });

    socket.on("createMessage", (obj, cb) => {
        const user = users.get(obj.id);
        if (obj.file) {
            let stream = fs.createWriteStream(`assets/${obj.file}`, {
                encoding: "utf8"
            });
            stream.once("open", function (fd) {
                stream.write(obj.buffer);
                stream.end();
            });
            var mime = "image/png";
            var encoding = "base64";
            const fileToBuffer = (filename, cb) => {
                let readStream = fs.createReadStream(filename);
                let chunks = [];
                // Handle any errors while reading
                readStream.on("error", err => {
                    // handle error
                    // File could not be read
                    return cb(err);
                });
                // Listen for data
                readStream.on("data", chunk => {
                    chunks.push(chunk);
                });
                // File is done being read
                readStream.on("close", () => {
                    // Create a buffer of the image from the stream
                    return cb(null, Buffer.concat(chunks));
                });
            };
            fileToBuffer(`assets/${obj.file}`, (err, imageBuffer) => {
                if (err) {
                    socket.emit("error", err);
                } else {
                    let result =
                        "data:" +
                        mime +
                        ";" +
                        encoding +
                        "," +
                        imageBuffer.toString("base64");
                    io.to(user.room).emit(
                        "newMessage",
                        m(user.name, obj.text, obj.id, uuid(), result)
                    );
                }
            });
            cb(true);
            return;
        }
        io.to(user.room).emit(
            "newMessage",
            m(user.name, obj.text, obj.id, obj.uuid)
        );
        cb(true);
    });
    socket.on("editMessage", data => {
        const user = users.get(data.id);
        console.log("data", data);
        io.to(user.room).emit(
            "editClientMessage",
            m(user.name, data.text, data.id, data.uuid)
        );
    });
    socket.on("inputWrite", data => {
        const user = users.get(data.id);
        if (user) {
            socket.broadcast.to(user.room).emit("inputSocket", user.name);
        }
    });
    socket.on("inputWriteFalse", data => {
        const user = users.get(data.id);
        if (user) {
            socket.broadcast.to(user.room).emit("inputSocket", false);
        }
    });

    socket.on("userLeft", (id, cb) => {
        const user = users.remove(id);
        if (user) {
            io.to(user.room).emit("updateUsers", users.getByRoom(user.room));
            io.to(user.room).emit(
                "newMessage",
                m("admin", `Пользователь ${user.name} вышел.`)
            );
        }
        cb();
    });

    socket.on("disconnect", () => {
        const user = users.remove(socket.id);
        if (user) {
            io.to(user.room).emit("updateUsers", users.getByRoom(user.room));
            io.to(user.room).emit(
                "newMessage",
                m("admin", `Пользователь ${user.name} вышел.`)
            );
        }
    });
});

module.exports = {
    app,
    server
};
