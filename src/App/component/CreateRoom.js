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
            button: [],
            load: false
        }
        this.noOfPlayer = 0;
        this.socketHost =
            window.location.hostname === "localhost"
                ? "http://localhost:3000"
                : window.location.hostname;
        this.socket = openSocket(this.socketHost);
        this.createRoom = this.createRoom.bind(this);
        this.getDataFromDb = this.getDataFromDb.bind(this);
        this.createNoOfPlayerButton = this.createNoOfPlayerButton.bind(this);
        this.checkValidation = this.checkValidation.bind(this);
        this.postData = this.postData.bind(this);
    }

    createRoom(room) {
        const roomId = +room;
        this.socket.emit('new-room', roomId);
        this.getDataFromDb(roomId);
    }

    checkValidation(e) {
        const id = e.target.getAttribute('id');
        const length = document.querySelectorAll('.player').length;
        const input = document.getElementsByClassName('CreateRoomBodyInput')[0];
        const name = document.getElementsByClassName('CreateRoomBodyInput1')[0];
        if (id) {
            for (let i = 0; i < length; i++) {
                document.querySelectorAll('.player')[i].style.background = 'white';
            }
            document.querySelectorAll('.player')[id - 2].style.background = 'lightblue'
            this.noOfPlayer = +id;
        } else {
            if (input.value.length > 0) {
                if (name.value.length > 1) {
                    if (this.noOfPlayer != 0) {
                        this.createRoom(input.value);
                    } else {
                        alert('Plz select no of players');
                    }
                } else {
                    alert('Plz enter name value greater then 2');
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
        this.setState({ load: true });
        axios.get(`${this.socketHost}/api/`, {
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
                    break;
                }
            }
            if (result) {
                this.setState({ data: response.data, roomId: room });
                this.postData(roomId);
            } else {
                this.setState({ data: response.data, roomId: room, load: false });
                alert(`ALREADY USED ROOMID:${roomId}. PLZ USE DIFFERENT ROOMID`);
                document.getElementsByClassName('CreateRoomBodyInput')[0].value = '';
                document.getElementsByClassName('CreateRoomBodyInput1')[0].value = '';
                for (let i = 0; i < document.querySelectorAll('.player').length; i++) {
                    document.querySelectorAll('.player')[i].style.background = 'white';
                }
                this.noOfPlayer = 0;
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    postData(roomId) {
        let pathName = window.location.pathname;
        const name = document.getElementsByClassName('CreateRoomBodyInput1')[0].value;
        pathName = '';
        let value = {
            name,
            color: 'red',
            inital: name[0].toUpperCase() + name[1].toUpperCase(),
            admin: 0
        }
        let data = {
            roomId: roomId,
            NOP: this.noOfPlayer,
            CNOP: 1,
            status: 'Matching',
            playerInfo: []
        }
        data.playerInfo.push(value);
        axios.post(`${this.socketHost}/api/newRoom`, {
            body: data
        }).then((response) => {
            this.props.history.push({
                pathname: `${pathName}waitRoom`,
                data,
                name
            })
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className='CreateRoomParent' style={{ display: this.state.load ? 'none' : 'block' }}>
                    <div className='CreateRoomBody'>Player Info</div>
                    <input className='CreateRoomBodyInput1' placeholder="Enter Name" minLength="2"></input>
                    <div className='CreateRoomBody'>Room Info</div>
                    <input pattern="^[0-9]" min="0" className='CreateRoomBodyInput' placeholder="Enter Room ID" maxLength="6" type='number'></input>
                    <div className='buttonHolder'>
                        <div className='Title'>Select No of Players</div>
                        {this.state.button}
                    </div>
                    <div>
                        <button onClick={this.checkValidation} className='createButton'>CREATE</button>
                    </div>
                </div>
                <div className='loader' style={{ display: this.state.load ? 'block' : 'none' }}>
                    <img width='300' height='300' src="https://media.giphy.com/media/kPtmy7oTGcgkBxRzAJ/giphy.gif" />
                </div>
            </React.Fragment>
        )
    }
}

export { CreateRoom };
