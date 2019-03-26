import React, { Component } from 'react';
import { Board } from './component/Board';
import { Start } from './component/Start';
import { BrowserRouter, Route, Switch } from "react-router-dom";

class Parent extends Component {
  render() {
    const pathName = window.location.pathname
    console.log(pathName,'path');
    return (
      <div className='Parent'>
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
}

export { Parent }
