import React, { Component } from 'react';
import { Board } from './component/Board';
import { Start } from './component/Start';
import { BrowserRouter, Route, Switch } from "react-router-dom";

class Parent extends Component {
  render() {
    const path = window.location.pathname
    return (
      <div className='Parent'>
        {/* <Start /> */}
        <BrowserRouter>
          <Switch>
            <Route exact path={path} component={Start} />
            <Route exact path={path} component={Board} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export { Parent }
