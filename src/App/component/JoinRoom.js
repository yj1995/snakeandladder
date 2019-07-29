import React, { Component } from 'react';
import axios from 'axios';
import { socket } from '../Parent';

class JoinRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roomId: [],
            data: [],
            load: false
        }
        this.socketHost =
            window.location.hostname === "localhost"
                ? "http://localhost:3000"
                : window.location.hostname;
        this.mounted = true;
        this.getDataFromDb = this.getDataFromDb.bind(this);
        this.JoinRoom = this.JoinRoom.bind(this);
        this.deleteData = this.deleteData.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    getDataFromDb() {
        axios.get(`${this.socketHost}/api/`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => {
                if (this.mounted) {
                    let room = [];
                    let data = [];
                    let deleteroom = [];
                    _.each(response.data, (value) => {
                        if (value.playerInfo.length != 0 && +value.CNOP != +value.NOP) {
                            room.push(value.roomId);
                            data.push(value);
                        } else {
                            deleteroom.push(value.roomId);
                        }
                    })
                    if (deleteroom.length != 0) {
                        this.deleteData(deleteroom);
                    } else {
                        this.setState({ load: true });
                    }
                    this.setState({ data, roomId: room })
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    deleteData(roomId) {
        let count = roomId.length;
        _.each(roomId, (value) => {
            axios.post(`${this.socketHost}/api/delete`, {
                body: value
            }).then((response) => {
                count--;
                if (!count) {
                    this.setState({ load: true });
                }
            }).catch((error) => {
                console.log(error);
            });
        })
    }

    existingRoom() {
        let room = [];
        if (this.state.roomId.length != 0) {
            _.forEach(this.state.data, data => room.push(<button key={`roomId_${data.roomId}`} disabled={data.status == "Matched" ? true : false} className='Room' onClick={this.JoinRoom} roomid={data.roomId} style={{ pointerEvents: (data.status == "Matched") ? "none" : null }}><div>RoomId: {data.roomId}</div><div>{data.CNOP} of {data.NOP} <span style={{ color: "red" }}>"{data.status}"</span></div></button>));
        } else {
            room.push(<button key={`roomId_${0}`} className='Room'>No Room Available Plz Click to Join</button>);
        }
        return room;
    }

    JoinRoom(e) {
        let pathName = window.location.pathname;
        pathName = '';
        const roomId = e.currentTarget.getAttribute('roomid');
        let room = this.state.data;
        let updateData = [];
        updateData = _.find(room, data => { return data.roomId == roomId })
        let { CNOP, NOP, status, ...value } = updateData;
        if (CNOP < NOP) {
            ++CNOP;
            if (CNOP == NOP && status != "Matched") {
                status = "Matched";
            }
        }
        socket.emit('joining', updateData.roomId);
        updateData = { CNOP, NOP, status, ...value };
        this.props.history.push({
            pathname: `${pathName}PlayerInfo`,
            data: updateData,
            room: updateData.roomId,
            socket: socket
        })
        this.updateData(updateData);
    }

    updateData(updateData) {
        axios.post(`${this.socketHost}/api/update`, {
            body: updateData
        }).then((response) => {
        }).catch((error) => {
            console.log(error);
        });
    }
    componentDidUpdate() {
        this.getDataFromDb();
    }

    componentDidMount() {
        this.getDataFromDb();
        socket.on('joined', function (msg) {
            console.log(msg);
        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }
    render() {
        return (
            <React.Fragment>
                <div className='JoinRoomParent' style={{ display: this.state.load ? 'block' : 'none' }}>
                    <div className='JoinRoomBody'>Join Room</div>
                    <div className='RoomHolder'>{this.existingRoom()}</div>
                </div>
                <div className='loader' style={{ display: !this.state.load ? 'block' : 'none' }}>
                    <img width='300' height='300' src="https://media.giphy.com/media/kPtmy7oTGcgkBxRzAJ/giphy.gif" />
                </div>
            </React.Fragment>
        )
    }
}

export { JoinRoom };
