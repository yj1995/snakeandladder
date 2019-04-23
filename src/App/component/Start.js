import React, { Component } from 'react'

class Start extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showPopUp: false,
            popup: 'none'
        }
        this.showPopUp = this.showPopUp.bind(this);
    }

    showPopUp(e) {
        console.log(e.target.getAttribute('type'));
        const pathName = window.location.pathname;
        let type = e.target.getAttribute('type');
        if (type === 'play') {
            this.setState({ popup: 'block' });
        } else if (type === 'Online') {
            this.props.history.push({
                pathname: `${pathName}Online`
            })
        } else {
            this.props.history.push({
                pathname: `${pathName}Offline`
            })
        }
    }
    render() {
        return (
            <div className='startPage' style={{ textAlign: 'center', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                <div style={{ fontFamily: 'fantasy', fontSize: 72, color: 'white' }}><span style={{ color: 'orange' }}>Snake</span> and <span style={{ color: 'black' }}>Ladder</span></div>
                <div style={{ marginTop: 20, display: this.go }}><button onClick={this.showPopUp} style={{ width: 90, height: 90, borderRadius: '50%', background: 'red', textAlign: 'center', fontFamily: 'fantasy', fontSize: 26, lineHeight: '90px' }} type='play'>PLAY</button></div>
                <div className='popup' style={{ position: 'absolute', display: this.state.popup, left: 0, top: 0, width: '100%', height: '100%', backgroundColor: '#CDDC39' }}>
                    <div className='popupHolder' style={{ position: 'absolute', left: 0, top: 0, height: 120, top: 0, bottom: 0, margin: 'auto auto', width: '100%' }}>
                        <button className='button' onClick={this.showPopUp} style={{ position: 'relative', width: 120, height: '100%', margin: '0px 15px', fontFamily: 'fantasy', fontSize: 21, borderRadius: '50%', padding: 0, border: 'none' }} type='Online'>ROOM</button>
                        <button className='button' onClick={this.showPopUp} style={{ position: 'relative', width: 120, height: '100%', margin: '0px 15px', fontFamily: 'fantasy', fontSize: 21, borderRadius: '50%', padding: 0, border: 'none' }} type='Offline'>SELF</button>
                    </div>
                </div>
            </div >
        )
    }
}

export { Start };
