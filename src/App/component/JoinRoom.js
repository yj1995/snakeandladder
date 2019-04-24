import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import axios from 'axios';

class JoinRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roomId: [],
            data: []
        }
        this.socket = openSocket('localhost:3000');
        this.createRoom = this.createRoom.bind(this);
        this.getDataFromDb = this.getDataFromDb.bind(this);
    }

    createRoom() {
        const room = document.getElementById('room').value;
        this.socket.emit('new-room', room);
        this.getDataFromDb();
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
        this.socket.on('created-room', (msg) => {
            const roomId = this.state.roomId;
            roomId.push(msg);
            this.setState({
                roomId
            })
        });
        this.getDataFromDb();
    }
    getDataFromDb() {
        axios.get('http://localhost:3000/', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => {
                console.log(response)
                let room = [];
                _.each(response.data, (value) => {
                    room.push(value.roomId);
                })
                this.setState({ data: response.data, roomId: room })
            })
            .catch((error) => {
                console.log(error);
            });
    }
    render() {
        console.log('sadgyugdsyag');
        return (
            <div>
               ComingSoon
            </div>
        )
    }
}

export { JoinRoom };
