const express = require('express');
const path = require('path');
const app = express();
let cors = require('cors');
const logger = require('morgan');
const Data = require('./models/Mongo')
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const router = express.Router();

const uri = "mongodb+srv://yash:yash123@snakeandladder-4nxaa.gcp.mongodb.net/test?retryWrites=true";

// const client = new MongoClient(uri, { useNewUrlParser: true });
// let collection;
// app.use(bodyParser.json());
// client.connect((response, err) => {
//     collection = client.db("game").collection("rooms").find().toArray().then((users) => {
//     });
//     // perform actions on the collection object
//     client.close();
// });

app.use(cors());

mongoose.connect(
    uri,
    { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", (res) => console.log("connected to the database",res));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// append /api for our http requests
app.use("/api", router);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
    console.log('fadsfhadgsfghad')
    Data.find((err, data) => {
        console.log('adsfdafhj')
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
    const { id, update } = req.body;
    Data.findOneAndUpdate(id, update, err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
    const { id } = req.body;
    Data.findOneAndDelete(id, err => {
        if (err) return res.send(err);
        return res.json({ success: true });
    });
});

// this is our create methid
// this method adds new data in our database
router.post("/", (req, res) => {
    console.log('dasgdashdashj')
    let data = new Data();

    const { id, message } = req.body;

    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: "INVALID INPUTS"
        });
    }
    data.message = message;
    data.id = id;
    data.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));

    app.get('*', (req, res) => {
        console.log(path);
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    })
}
const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`Server started on port ${port}`));

io.on('connection', function (socket) {
    socket.on('new-room', function (msg) {
        io.emit('created-room', msg);
    })
    socket.on('disconnect', function (msg) {
    });
})
