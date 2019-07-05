import React, { Component } from 'react';
import axios from 'axios';
import './style.less';

class waitRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: '',
            load: false
        }
        this.socketHost =
            window.location.hostname === "localhost"
                ? "http://localhost:3000"
                : window.location.hostname;
        this.mounted = true;
        this.getDataFromDb = this.getDataFromDb.bind(this);
        this.waitingPlayerInfo = this.waitingPlayerInfo.bind(this);
    }

    getDataFromDb() {
        let pathName = window.location.pathname;
        pathName = '';
        axios.get(`${this.socketHost}/api/`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => {
                if (this.mounted) {
                    let data = '';
                    _.each(response.data, (value) => {
                        if (+this.props.location.data.roomId === value.roomId) {
                            data = value;
                        }
                    })

                    console.log(+data.CNOP === +data.NOP);
                    if (+data.CNOP === +data.NOP) {
                        this.setState({ data, load: true }, () => {
                            this.props.history.push({
                                pathname: `${pathName}Board`,
                                data: data.playerInfo,
                                name: this.props.location.name
                            })
                        })
                    } else {
                        this.setState({ data, load: true })
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    waitingPlayerInfo() {
        let playerData = [];
        if (this.state.data != "" && this.state.data.playerInfo.length != 0) {
            _.forEach(this.state.data.playerInfo, data => playerData.push(<div key={`playerInfo_${data.admin}`} className='playerData' style={{ background: data.color, color: 'black' }}>{data.inital}</div>));
        }
        return playerData;
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
                <div className='CreateRoomParent' style={{ display: this.state.load ? 'block' : 'none' }}>
                    <div className='CreateRoomBody'>Waiting Room</div>
                    <div className='RoomHolder'>{this.waitingPlayerInfo()}</div>
                </div>
                <div className='loader' style={{ display: !this.state.load ? 'block' : 'none' }}>
                    <img width='300' height='300' src="https://media.giphy.com/media/kPtmy7oTGcgkBxRzAJ/giphy.gif" />
                </div>
            </React.Fragment>
        )
    }
}

export { waitRoom };
