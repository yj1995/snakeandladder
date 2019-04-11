import React, { Component } from 'react';
import { Board } from './component/Board';
import { Start } from './component/Start';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import openSocket from 'socket.io-client';
import axios from 'axios';

class Parent extends Component {
  constructor(props) {
    super(props)
    window.display = this;
    this.state = {
      roomId: []
    }
    this.socket = openSocket('localhost:3000');
    this.handleResize = this.handleResize.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.getDataFromDb = this.getDataFromDb.bind(this);
  }

  handleResize() {
    const windowHeight = window.innerHeight;
    const widowWidth = window.innerWidth;
    let height, width, scale, left, top = 0;
    // const scaleX = window.innerWidth / 1250;
    // const scaleY = window.innerHeight / 937;
    // // const left = Math.abs(width - (1250 * scaleY)) / 2;
    // // console.log(width,1250 * scaleY);
    if (windowHeight < widowWidth) {
      height = windowHeight;
      width = (1024 / 690) * height;
      const newLeft = (widowWidth / 2) - (1024 / 2);
      if (newLeft < 0) {
        width = widowWidth;
        height = (690 / 1024) * width;
      }
      scale = height / 690;
      if (scale > 1) {
        scale = 1;
      }
    }
    else {
      width = widowWidth;
      height = (690 / 1024) * widowWidth;
      scale = (width) / 1024;
    }
    // console.log('width', widowWidth, 'height', windowHeight, 'scale', scale)
    left = Math.abs((widowWidth / 2) - (width / 2));
    top = Math.abs((windowHeight / 2) - (height / 2));
    if (width <= 1024 || height <= 690) {
      document.querySelector('.root').style.transform = `scale(${scale},${scale})`
      document.querySelector('.root').style.width = `${width}px`;
      document.querySelector('.root').style.height = `${height}px`;
      document.querySelector('.root').style.left = `${left}px`;
      document.querySelector('.root').style.top = `${top}px`;
    } else if (window.devicePixelRatio === 2 || window.devicePixelRatio === 3) {
      document.querySelector('.root').style.transform = `scale(${scale},${scale})`
      document.querySelector('.root').style.width = `${width}px`;
      document.querySelector('.root').style.height = `${height}px`;
      document.querySelector('.root').style.left = `${0}px`;
      document.querySelector('.root').style.top = `${0}px`;
    } else {
      document.querySelector('.root').style.transform = `scale(1,1)`
      document.querySelector('.root').style.width = `1250px`;
      document.querySelector('.root').style.height = `700px`;
      document.querySelector('.root').style.left = `0px`;
      document.querySelector('.root').style.top = `0px`;
    }
  }

  createRoom() {
    const room = document.getElementById('room').value;
    this.socket.emit('new-room', room);
    this.getDataFromDb();
  }

  render() {
    const pathName = window.location.pathname
    return (
      <div className='Parent' style={{ position: 'absolute', width: '100%', height: '100%', background: '#63820C' }}>
        {/* <Start /> */}
        <input id='room' /><button onClick={this.createRoom}>create</button>
        <BrowserRouter>
          <Switch>
            <Route exact path={pathName} component={Start} />
            <Route path={`${pathName}Board`} component={Board} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    this.socket.on('created-room', (msg) => {
      const roomId = this.state.roomId;
      roomId.push(msg);
      this.setState({
        roomId
      })
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
  getDataFromDb() {
    const path = `${window.location.href}`
    axios.get(path, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(function (response) {
        console.log(response.body);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
}

export { Parent }
