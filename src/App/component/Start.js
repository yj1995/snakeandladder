import React, { Component } from 'react'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { Option } from './Option';
import { ENETUNREACH } from 'constants';

class Start extends Component {
  constructor(props) {
    super(props)
    this.go = 'block'
    this.color = [];
    this.start = 'none';
    this.optionValue = [];
    this.colorName = ['select the piece color', 'red', 'green', 'gold', 'grey', 'blue', 'pink', 'orange', 'purple'],
      this.state = {
        player: '',
        details: [],
        word: 'GO'
      }
    this.getValue = this.getValue.bind(this);
    this.getDetails = this.getDetails.bind(this);
    this.option = this.option.bind(this);
    this.createDetailBox = this.createDetailBox.bind(this);
    this.option('option', 6, this.optionValue);
  }

  getValue() {
    const value = +(document.querySelector('select').value);
    this.go = 'none'
    document.querySelector('select').setAttribute('disabled', 'disabled')
    this.createDetailBox(value);
    this.start = 'block';
  }
  getDetails() {
    const playerName = document.querySelectorAll('.playerName');
    const color = document.querySelectorAll('.Color');
    const completeDetails = [];
    console.log()
    _.each(playerName, (obj, index) => completeDetails.push({ name: obj.value ? obj.value : `player_${index}`, inital: obj.value ? `${obj.value[0].toUpperCase()}_${index}` : `P_${index}` }));
    _.each(color, (obj, index) => completeDetails[index].color = obj.value != 'select the piece color' ? obj.value : 'black');
    this.props.history.push({
      pathname: '/Board',
      data: completeDetails // your data array of objects
    })
  }
  createDetailBox(value) {
    const details = [];
    for (let i = 1; i <= value; i++) {
      details.push(<div key={i}><input placeholder={`playerName_${i}`} className='playerName' style={{ margin: 5 }}></input><select className='Color'>{this.option('color', this.colorName.length, this.color, i)}</select></div>)
    }
    this.setState({
      details
    })
    return details
  }
  option(name, colorName, array, playerNo = null) {
    if (array.length) {
      array = [];
    }
    for (let i = 1; i <= colorName; i++) {
      array.push(<Option key={`${name}_${i}_${playerNo}`} id={name === 'color' ? this.colorName[i - 1] : i} />)
    }
    return array;
  }
  render() {
    return (
      <div className='startPage' style={{ position: 'absolute', width: 1028, textAlign: 'center' }}>
        <h1>Welcome To Game</h1>
        <h2>Number Of Player</h2>
        <select className='Player'>
          {this.optionValue}
        </select>
        <div>
          {this.state.details}
        </div>
        <div style={{ marginTop: 10, display: this.go }}><button onClick={this.getValue}>GO</button></div>
        <div style={{ marginTop: 10, display: this.start }}><button onClick={this.getDetails}>START</button></div>
      </div>
    )
  }
}

export { Start };
