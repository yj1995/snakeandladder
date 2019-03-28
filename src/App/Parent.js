import React, { Component } from 'react';
import { Board } from './component/Board';
import { Start } from './component/Start';
import { BrowserRouter, Route, Switch } from "react-router-dom";

class Parent extends Component {
  constructor(props) {
    super(props)
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const scaleX = window.innerWidth / 1250;
    const scaleY = window.innerHeight / 700;

    if (width <= 1250 || height <= 700) {
      document.querySelector('.root').style.transform = `scale(${scaleX},${scaleX})`
      document.querySelector('.root').style.width = `${width}px`;
      document.querySelector('.root').style.height = `${height}px`;
    } else if (window.devicePixelRatio === 2 || window.devicePixelRatio === 3) {
      document.querySelector('.root').style.transform = `scale(1,1)`
      document.querySelector('.root').style.width = `${width}px`;
      document.querySelector('.root').style.height = `${height}px`;
    } else {
      document.querySelector('.root').style.transform = `scale(1,1)`
      document.querySelector('.root').style.width = `1250px`;
      document.querySelector('.root').style.height = `700px`;
    }
  }
  render() {
    const pathName = window.location.pathname
    return (
      <div className='Parent' style={{ position: 'absolute', width: '100%', height: '100%', background: '#63820C' }}>
        {/* <Start /> */}
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
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
}

export { Parent }
