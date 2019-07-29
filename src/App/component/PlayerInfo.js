import React, { Component } from 'react';
import axios from 'axios';
import { socket } from '../Parent';
import './style.less';

class PlayerInfo extends Component {
    constructor(props) {
        super(props)
        this.userData = this.props.location;
        this.state = {
            load: false,
            socket: this.userData.socket
        }
        console.log(socket);
        this.socketHost =
            window.location.hostname === "localhost"
                ? "http://localhost:3000"
                : window.location.hostname;
        this.playerData = this.playerData.bind(this);
    }

    playerData() {
        const color = ['red', 'green', 'yellow', 'grey', 'blue', 'orange', 'purple'];
        let pathName = window.location.pathname;
        pathName = '';
        const playerName = document.getElementsByClassName('CreateRoomBodyInput')[0].value;

        if (playerName.length < 2) {
            alert('Plz enter name value greater then 2');
            document.getElementsByClassName('CreateRoomBodyInput')[0].value = '';
        } else {
            this.setState({ load: true });
            axios.get(`api/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then((response) => {
                let player = _.find(response.data, (value) => {
                    return +this.userData.room === value.roomId;
                })
                console.log(player, this.userData.room);
                let { playerInfo, ...value } = player;
                let infoData = {
                    name: playerName,
                    color: color[playerInfo.length],
                    inital: playerName[0].toUpperCase() + playerName[1].toUpperCase(),
                    admin: playerInfo.length,
                    state: false
                }
                playerInfo.push(infoData);
                player = { playerInfo, ...value };
                axios.post(`api/update`, {
                    body: player
                }).then((response) => {
                    pathName = "";
                    socket.emit(`new-player`, { data: player.playerInfo[player.playerInfo.length - 1], mySocketId: player.playerInfo.length - 1, room: +this.userData.room });
                    this.props.history.push({
                        pathname: `${pathName}waitRoom`,
                        data: player,
                        admin: playerInfo.length - 1,
                        room: +this.userData.room,
                        socket: socket
                    })
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    componentDidMount() {
        socket.on(`${this.userData.room}_new-player`, (data) => {
            console.log('data', data);
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className='CreateRoomParent' style={{ display: this.state.load ? 'none' : 'block' }}>
                    <div className='CreateRoomBody'>PlayerInfo</div>
                    <div className='CreateRoomBody' style={{ fontSize: 50 }}>Enter Player Name</div>
                    <input className='CreateRoomBodyInput' placeholder="Enter Name" minLength="2" maxLength="8"></input>
                    <div>
                        <button onClick={this.playerData} className='createButton'>Done</button>
                    </div>
                </div>
                <div className='loader' style={{ display: this.state.load ? 'block' : 'none' }}>
                    <img width='300' height='300' src="https://media.giphy.com/media/kPtmy7oTGcgkBxRzAJ/giphy.gif" />
                </div>
            </React.Fragment>
        )
    }
}

export { PlayerInfo };