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
        io.emit('created-room', msg);
    })
    socket.on('new-player', function (info) {
        const { data, mySocketId } = info;
        player[mySocketId] = data;
        io.sockets.emit('update', player);
    })
    socket.on('movement', function (info) {
        const { data, mySocketId } = info;
        var player = player[mySocketId] || {};
        player.position = data;
        io.sockets.emit('update', player);
    })
    socket.on('disconnect', function (info) {
        const { mySocketId, ...values } = info;
        delete player[mySocketId];
    });
})
