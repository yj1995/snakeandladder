import React, { Component } from 'react';
import axios from 'axios';

class JoinRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roomId: [],
            data: []
        }
        this.socketHost =
            window.location.hostname === "localhost"
                ? "http://localhost:8080"
                : window.location.hostname;
        this.mounted = true;
        this.getDataFromDb = this.getDataFromDb.bind(this);
        this.JoinRoom = this.JoinRoom.bind(this);
        this.updateData = this.updateData.bind(this);
        console.log(this.socketHost);
    }

    getDataFromDb() {
        axios.get(`${this.socketHost}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => {
                if (this.mounted) {
                    let room = [];
                    _.each(response.data, (value) => {
                        room.push(value.roomId);
                    })
                    this.setState({ data: response.data, roomId: room })
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    existingRoom() {
        let room = [];
        _.forEach(this.state.data, data => room.push(<button key={`roomId_${data.roomId}`} disabled={data.status == "Matched" ? true : false} className='Room' onClick={this.JoinRoom} roomid={data.roomId} style={{ pointerEvents: (data.status == "Matched") ? "none" : null }}><div>RoomId: {data.roomId}</div><div>{data.CNOP} of {data.NOP} <span style={{ color: "red" }}>"{data.status}"</span></div></button>));
        return room;
    }

    JoinRoom(e) {
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
        updateData = { CNOP, NOP, status, ...value };
        this.updateData(updateData);
    }

    updateData(updateData) {
        axios.post(`${this.socketHost}/update`, {
            body: updateData
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }
    componentDidUpdate() {
        this.getDataFromDb();
    }

    componentDidMount() {
        this.getDataFromDb();
    }

    componentWillUnmount() {
        this.mounted = false;
    }
    render() {
        return (
            <React.Fragment>
                <div className='JoinRoomParent'>
                    <div className='JoinRoomBody'>Join Room</div>
                    <div className='RoomHolder'>{this.existingRoom()}</div>
                </div>
            </React.Fragment>
        )
    }
}

export { JoinRoom };
