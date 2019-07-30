const express = require('express');
const path = require('path');
const app = express();
let cors = require('cors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const router = require('./mongoRouting');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", router);

if (process.env.NODE_ENV === 'production') {
    app.disable("x-powered-by")
    app.use(logger("common"));
    app.use(express.static(path.resolve(__dirname, './dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, './dist', 'index.html'));
    })
}
const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`Server started on port ${port}`));

const player = {};

io.on('connection', function (socket) {
    socket.on('new-room', function (msg) {
        socket.join(msg);
        io.emit('created-room', msg);
    })
    socket.on('joining', function (msg) {
        var room = io.nsps['/'].adapter.rooms[`${msg}`];
        if (room && room.length == 1) {
            socket.join(room);
        }
        io.emit('joined', msg);
    })
    socket.on(`new-player`, function (info) {
        const { data, mySocketId, room, newRoom } = info;
        console.log(newRoom);
        if (player[mySocketId] != undefined) {
            if (newRoom) {
                player = {};
            }
            player[mySocketId] = data;
        } else {
            player[mySocketId] = data;
        }
        io.emit(`${room}_new-player`, player);
    })
    socket.on(`movement`, function (info) {
        const { data, mySocketId, room } = info;
        if (Object.keys(player).length == 0) {
            data.forEach((element, i) => {
                player[i] = element;
            });
        } else if (typeof (mySocketId) == 'number') {
            player[mySocketId] = data;
            Object.keys(player).forEach((val) => {
                if (+val != +mySocketId) {
                    player[val].chance = false;
                } else {
                    player[val].chance = true;
                }
            })
        }
        io.emit(`${room}_movement`, player);
    })
    socket.on('disconnect', function (info) {
        console.log('user disconnected');
    });
})
