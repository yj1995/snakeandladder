import React, { Component } from 'react';
import { Board } from './component/Board';
import { Offline } from './component/Offline';
import { Online } from './component/Online';
import { Start } from './component/Start';
import { CreateRoom } from './component/CreateRoom';
import { JoinRoom } from './component/JoinRoom';
import { PlayerInfo } from './component/PlayerInfo';
import { boardServer } from './component/boardServer';
import openSocket from 'socket.io-client';
import { waitRoom } from './component/waitRoom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
const socket = openSocket(window.location.hostname === "localhost" ? "http://localhost:3000" : window.location.hostname);

class Parent extends Component {
  constructor(props) {
    super(props)
    this.handleResize = this.handleResize.bind(this);
    if (window.performance) {
      if (performance.navigation.type == 1) {
        let currentpath = window.location.pathname.split('/');
        if (currentpath.length > 1) {
          window.location.pathname = '/';
        } else {
          window.location.pathname = `/${currentpath[1]}/`;
        }
      }
    }
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

  render() {
    const pathName = window.location.pathname;
    return (
      <div className='Parent' style={{ position: 'absolute', width: '100%', height: '100%', background: '#63820C' }}>
        {/* <Start /> */}
        <BrowserRouter>
          <Switch>
            <Route exact path={`${pathName}`} component={Start} />
            <Route path={`${pathName}Online`} component={Online} />
            <Route path={`${pathName}Offline`} component={Offline} />
            <Route path={`${pathName}CreateRoom`} component={CreateRoom} />
            <Route path={`${pathName}JoinRoom`} component={JoinRoom} />
            <Route path={`${pathName}PlayerInfo`} component={PlayerInfo} />
            <Route path={`${pathName}waitRoom`} component={waitRoom} />
            <Route path={`${pathName}boardServer`} component={boardServer} />
            <Route path={`${pathName}Board`} component={Board} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
}

export { Parent, socket };
