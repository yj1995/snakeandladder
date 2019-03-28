import React, { Component } from 'react'
import { Option } from './Option';

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
    const pathName = window.location.pathname;
    const playerName = document.querySelectorAll('.playerName');
    const color = document.querySelectorAll('.Color');
    const completeDetails = [];
    console.log()
    _.each(playerName, (obj, index) => completeDetails.push({ name: obj.value ? obj.value.toUpperCase() : `PLAYER_${index}`, inital: obj.value ? `${obj.value[0].toUpperCase()} ${obj.value[1].toUpperCase()}` : `PL` }));
    _.each(color, (obj, index) => completeDetails[index].color = obj.value != 'select the piece color' ? obj.value : 'black');
    this.props.history.push({
      pathname: `${pathName}Board`,
      data: completeDetails // your data array of objects
    })
  }
  createDetailBox(value) {
    const details = [];
    for (let i = 1; i <= value; i++) {
      details.push(<div key={i}><input placeholder={`playerName_${i}`} className='playerName' style={{ margin: 13, height: 16, fontFamily: 'monospace', fontSize: 15, boxShadow: '0px 2px #96999a' }}></input><select className='Color'>{this.option('color', this.colorName.length, this.color, i)}</select></div>)
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
      <div className='startPage' style={{ textAlign: 'center', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
        <div style={{ fontFamily: 'fantasy', fontSize: 72, color: 'white' }}><span style={{ color: 'orange' }}>Snake</span> and <span style={{ color: 'black' }}>Ladder</span></div>
        <div style={{ fontFamily: 'fantasy', fontSize: 52, color: 'white' }}>Number Of Player</div>
        <select className='Player' style={{ width: 60 }}>
          {this.optionValue}
        </select>
        <div>
          {this.state.details}
        </div>
        <div style={{ marginTop: 20, display: this.go }}><button onClick={this.getValue} style={{ width: 90, height: 90, borderRadius: '50%', background: 'red', textAlign: 'center', fontFamily: 'fantasy', fontSize: 30, lineHeight: '90px' }}>GO</button></div>
        <div style={{ marginTop: 20, display: this.start }}><button onClick={this.getDetails} style={{ minWidth: 90, minHeight: 90, borderRadius: '50%', background: 'red', textAlign: 'center', fontFamily: 'fantasy', fontSize: 22, lineHeight: '90px' }}>START</button></div>
      </div>
    )
  }
}

export { Start };
