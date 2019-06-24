import React, { Component } from 'react';
import axios from 'axios';
import './style.less';

class PlayerInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            load: false
        }
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
            axios.get(`${this.socketHost}/api/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then((response) => {
                let player = _.find(response.data, (value) => {
                    return +this.props.location.data.roomId === value.roomId;
                })
                let { playerInfo, ...value } = player;
                if (playerInfo == undefined) {
                    let value = {
                        name: playerName,
                        color: color[playerInfo.length],
                        inital: playerName[0].toUpperCase() + playerName[1].toUpperCase(),
                        admin: playerInfo.length
                    }
                    playerInfo.push(value);
                } else {
                    let value = {
                        name: playerName,
                        color: color[playerInfo.length],
                        inital: playerName[0].toUpperCase() + playerName[1].toUpperCase(),
                        admin: playerInfo.length
                    }
                    playerInfo.push(value);
                }
                player = { playerInfo, ...value };
                axios.post(`${this.socketHost}/api/update`, {
                    body: player
                }).then((response) => {
                    this.props.history.push({
                        pathname: `${pathName}waitRoom`,
                        data: player,
                        name: playerName
                    })
                }).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className='CreateRoomParent' style={{ display: this.state.load ? 'none' : 'block' }}>
                    <div className='CreateRoomBody'>PlayerInfo</div>
                    <div className='CreateRoomBody' style={{ fontSize: 50 }}>Enter Player Name</div>
                    <input className='CreateRoomBodyInput' placeholder="Enter Name" minLength="2"></input>
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