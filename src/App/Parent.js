import React, { Component } from 'react';
import { Board } from './component/Board';
import { Start } from './component/Start';
import { BrowserRouter, Route, Switch } from "react-router-dom";

class Parent extends Component {
  render() {
    return (
      <div className='Parent'>
        {/* <Start /> */}
        <BrowserRouter>
          <Switch>
          <Route exact path='/' component={Start}/>
          <Route exact path='/Board' component={Board}/>
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export { Parent }
