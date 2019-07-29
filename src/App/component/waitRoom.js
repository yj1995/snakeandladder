import React, { Component } from 'react';
import './style.less';
import { socket } from '../Parent';

class waitRoom extends Component {
    constructor(props) {
        super(props)
        this.start = false;
        this.userData = this.props.location;
        this.waitingPlayerInfo = this.waitingPlayerInfo.bind(this);
        this.readyState = this.readyState.bind(this);
        this.state = {
            data: [],
            load: false
        }
    }

    waitingPlayerInfo() {
        let playerData = [];
        const storedData = this.state.data.playerInfo ? this.state.data.playerInfo : this.state.data;
        if (storedData.length != 0) {
            _.forEach(storedData, data => {
                playerData.push(
                    <div key={`playerInfo_${data.admin}`} className='playerData' style={{ background: data.color, color: 'black' }}>{data.inital}</div>
                )
            });
        }
        return playerData;
    }

    readyState(e) {
        const id = e.target.getAttribute('id');
        const storeData = this.state.data;
        if (+id) {
            _.forEach(storeData, (value, i) => {
                if (+id === value.admin && !value.state) {
                    value.state = true;
                    value.chance = false;
                    document.getElementById(id).setAttribute('disabled', true);
                }
            })
            this.setState({ load: false, data: storeData });
            socket.emit('new-player', { data: storeData[+id], mySocketId: +id, room: +this.userData.room });
            // this.postData(storeData);
        } else {
            storeData[+id].state = true;
            storeData[+id].chance = true;
            this.setState({ load: false, data: storeData });
            socket.emit('new-player', { data: storeData[+id], mySocketId: +id, room: +this.userData.room });
            document.getElementById(id).setAttribute('disabled', true);
            // this.postData(storeData);
        }
    }

    componentDidMount() {
        socket.on(`${this.userData.room}_new-player`, (data) => {
            let pathName = "";
            const DB = [];
            let count = 0;
            let start = false;
            const keys = Object.keys(data);
            keys.forEach((val, i) => {
                DB.push(data[val]);
            })
            console.log(DB);
            _.each(DB, value => {
                if (value.state) {
                    count++;
                }
            })
            if (count === +this.userData.data.NOP) {
                start = true;
            }
            if (count == +this.userData.data.NOP - 1) {
                this.start = true;
            }
            if (start) {
                this.props.history.push({
                    pathname: `${pathName}boardServer`,
                    data: this.state.data,
                    admin: this.userData.admin,
                    room: +this.userData.room
                })
            }
            this.setState({ data: DB, load: true })
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className='CreateRoomParent' style={{ display: this.state.load ? 'block' : 'none' }}>
                    <div className='CreateRoomBody'>Waiting Room</div>
                    <div className='RoomHolder'>{this.waitingPlayerInfo()}</div>
                    <button id={this.userData.admin} disabled={(this.userData.admin === 0 && !this.start) ? true : false} onClick={this.readyState}>{this.userData.admin === 0 ? 'Start' : 'Ready'}</button>
                </div>
                <div className='loader' style={{ display: !this.state.load ? 'block' : 'none' }}>
                    <img width='300' height='300' src="https://media.giphy.com/media/kPtmy7oTGcgkBxRzAJ/giphy.gif" />
                </div>
            </React.Fragment>
        )
    }
}

export { waitRoom };
