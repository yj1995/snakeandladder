import React, { Component } from 'react'

class Online extends Component {
    constructor(props) {
        super(props)
        this.roomTypeClick = this.roomTypeClick.bind(this);
    }
    roomTypeClick(e) {
        let pathName = window.location.pathname;
        pathName = '';
        const roomType = e.target.getAttribute('type');
        if (roomType === 'Create') {
            this.props.history.push({
                pathname: `${pathName}CreateRoom`
            })
        } else {
            this.props.history.push({
                pathname: `${pathName}JoinRoom`
            })
        }
    }
    render() {
        return (
            <div className='startPage' style={{ textAlign: 'center', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                <div style={{ fontFamily: 'fantasy', fontSize: 72, color: 'white' }}><span style={{ color: 'orange' }}>Snake</span> and <span style={{ color: 'black' }}>Ladder</span></div>
                <div style={{ marginTop: 20, display: 'block' }}>
                    <button onClick={this.roomTypeClick} style={{ width: 90, minHeight: 90, borderRadius: '50%', background: 'red', textAlign: 'center', fontFamily: 'fantasy', fontSize: 22, margin: '0px 10px', boxSizing: 'content-box', padding: '10px 10px' }} type='Join'>Join Room</button>
                    <button onClick={this.roomTypeClick} style={{ width: 90, minHeight: 90, borderRadius: '50%', background: 'red', textAlign: 'center', fontFamily: 'fantasy', fontSize: 22, margin: '0px 10px', boxSizing: 'content-box', padding: '10px 10px' }} type='Create'>Create Room</button>
                </div>
            </div >
        )
    }
}

export { Online };

