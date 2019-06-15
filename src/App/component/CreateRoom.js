import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import axios from 'axios';
import './style.less';

class CreateRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roomId: [],
            data: [],
            button: []
        }
        this.noOfPlayer = 0;
        this.socket = openSocket('localhost:3000');
        this.createRoom = this.createRoom.bind(this);
        this.getDataFromDb = this.getDataFromDb.bind(this);
        this.createNoOfPlayerButton = this.createNoOfPlayerButton.bind(this);
        this.checkValidation = this.checkValidation.bind(this);
        this.postData = this.postData.bind(this);
    }

    createRoom(room) {
        const roomId = +room;
        console.log('roomid');
        this.socket.emit('new-room', roomId);
        this.getDataFromDb(roomId);
    }

    checkValidation(e) {
        console.log('hiii');
        const id = e.target.getAttribute('id');
        const length = document.querySelectorAll('.player').length;
        const input = document.getElementsByClassName('CreateRoomBodyInput')[0];
        if (id) {
            for (let i = 0; i < length; i++) {
                document.querySelectorAll('.player')[i].style.background = 'white';
            }
            document.querySelectorAll('.player')[id - 2].style.background = 'lightblue'
            this.noOfPlayer = +id;
        } else {
            console.log('create');
            if (input.value.length > 0) {
                if (this.noOfPlayer != 0) {
                    this.createRoom(input.value);
                } else {
                    alert('Plz select no of players');
                }
            } else {
                alert('Plz enter room no');
            }
        }
    }

    createNoOfPlayerButton() {
        let button = [];
        for (let i = 0; i < 5; i++) {
            button.push(<button onClick={this.checkValidation} className='player' id={i + 2} key={'player_' + i}>{i + 2}</button>)
        }
        this.setState({ button });
    }

    componentDidMount() {
        this.socket.on('created-room', (msg) => {
            const roomId = this.state.roomId;
            roomId.push(msg);
            this.setState({
                roomId
            })
        });
        this.createNoOfPlayerButton();
    }
    getDataFromDb(roomId) {
        axios.get('/', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then((response) => {
            let room = [];
            _.each(response.data, (value) => {
                room.push(value.roomId);
            })
            let result = true;
            for (let i = 0; i < room.length; i++) {
                if (room[i] == roomId) {
                    result = false;
                }
            }
            if (result) {
                this.setState({ data: response.data, roomId: room })
                this.postData(roomId);
            } else {
                alert(`ALREADY USED ROOMID:${roomId}. PLZ USE DIFFERENT ROOMID`);
                document.getElementsByClassName('CreateRoomBodyInput')[0].value = '';
                for (let i = 0; i < length; i++) {
                    document.querySelectorAll('.player')[i].style.background = 'white';
                }
                this.noOfPlayer = 0;
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    postData(roomId) {
        const data = {
            roomId: roomId,
            NOP: this.noOfPlayer,
            CNOP: 1,
            status: 'Matching',
            playerInfo: []
        }
        axios.post('/newRoom', {
            body: data
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className='CreateRoomParent'>
                    <div className='CreateRoomBody'>Create Room</div>
                    <input className='CreateRoomBodyInput' placeholder="Enter Room ID" maxLength="6" ></input>
                    <div className='buttonHolder'>
                        <div className='Title'>Select No of Players</div>
                        {this.state.button}
                    </div>
                    <div>
                        <button onClick={this.checkValidation} className='createButton'>CREATE</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export { CreateRoom };
