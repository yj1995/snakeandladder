import React, { Component } from 'react'
import { Square } from './Square';
import { Piece } from './Piece';
import _ from 'lodash';
import { TweenMax } from "gsap/TweenMax";
import ReactDice from 'react-dice-complete';
import json from '../game.json'
import 'react-dice-complete/dist/react-dice-complete.css';
import { Ladder } from './Ladder&Snake';
import { timingSafeEqual } from 'crypto';

class Board extends Component {
  constructor(props) {
    super(props)
    window.display = this;
    this.PlayerWin = [];
    this.userData = this.props.location;
    this.Bool = false;
    this.ladder = [];
    this.snake = [];
    this.ladderClimb = [];
    this.snakeBite = [];
    this.position = [];
    this.rollValue = 0;
    this.currentPlayer;
    this.sixCount = [];
    this.square = [];
    this.playerChance = 0;
    this.state = {
      piece: [],
    }
    this.setSquare = this.setSquare.bind(this);
    this.rollDice = this.rollDice.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.setPiece = this.setPiece.bind(this);
    this.positionPiece = this.positionPiece.bind(this);
    this.rollDoneCallback = this.rollDoneCallback.bind(this);
    this.drawLadder = this.drawLadder.bind(this);
    this.drawSnake = this.drawSnake.bind(this);
    this.ladder_snake_Present = this.ladder_snake_Present.bind(this);
    this.PlayerStatus = this.PlayerStatus.bind(this);
  }

  setPosition() {
    let x = 0;
    let y = 0;
    for (let i = json.board.row - 1; i >= 0; i--) {
      y = i * json.square.size;
      x = 0;
      this.position[i] = [];
      if (i % 2 === 0) {
        for (let j = 0; j < json.board.col; j++) {
          x = j * json.square.size;
          if (j % 2 === 0) {
            this.position[i].push({ x: x, y: y, color: json.square.color1, fontColor: json.square.font1 });
          } else {
            this.position[i].push({ x: x, y: y, color: json.square.color2, fontColor: json.square.font2 });
          }
        }
      } else {
        for (let j = json.board.col - 1; j >= 0; j--) {
          x = j * json.square.size;
          if (j % 2 === 0) {
            this.position[i].push({ x: x, y: y, color: json.square.color2, fontColor: json.square.font2 });
          } else {
            this.position[i].push({ x: x, y: y, color: json.square.color1, fontColor: json.square.font1 });
          }
        }
      }
    }
  }
  componentDidMount() {
    this.setPosition();
    this.setSquare();
    this.drawLadder();
    this.drawSnake();
    this.setPiece();
  }

  drawLadder() {
    json.ladder.forEach((val, index) => {
      this.ladder.push(<Ladder key={`ladder_${index}`} id={`ladder_${index}`} data={this.square} position={val} />)
    });
    return this.ladder;
  }

  drawSnake() {
    json.snake.forEach((val, index) => {
      this.snake.push(<Ladder key={`snake_${index}`} id={`snake_${index}`} data={this.square} position={val} />)
    });
    return this.snake;
  }


  setPiece() {
    const arr = [];
    for (let i = 0; i < this.userData.data.length; i++) {
      arr.push({ x: json.Piece.width - (json.Piece.size + ((json.Piece.size + 5) * i)), y: 620, scale: 1, position: 0 })
      this.sixCount[i] = 0;
      this.ladderClimb[i] = 0;
      this.snakeBite[i] = 0;
    }
    this.setState({
      piece: arr
    })
  }

  positionPiece() {
    const piecesArr = [];
    this.state.piece.forEach((val, index) => {
      piecesArr.push(
        <Piece key={`piece_${index}`} id={this.userData.data[index].inital} x={val.x} y={val.y} color={this.userData.data[index].color} scale={val.scale} first={false} />
      )
    });
    return piecesArr;
  }

  setSquare() {
    let count = 101;
    let row = 0;
    this.position.forEach((val, index) => {
      row++;
      this.position[index].forEach((val, index) => {
        count--;
        this.square.push(<Square key={`square_${count}`} x={val.x} y={val.y} id={count} color={val.color} fontColor={val.fontColor} />);
        val.point = count;
        val.row = row;
      })
    })
    return this.square;
  }

  rollDice() {
    const piece = this.state.piece;
    const square = this.position;
    let currectValue = 0;
    let ladderPresent;
    let SnakePresent;
    let path = [];
    // if (ladderPresent) {
    //   ++this.ladderClimb[this.playerChance];
    // } else {
    //   ++this.snakeBite[this.playerChance];
    // }
    if (piece[this.playerChance].first) {
      if (this.rollValue === 6) {
        ++this.sixCount[this.playerChance]
      }
      currectValue = piece[this.playerChance].position + this.rollValue;
      if (currectValue <= 100) {
        this.currentPlayer = piece[this.playerChance].position;
        for (let i = this.rollValue; i > 0; i--) {
          ++this.currentPlayer;
          _.find(this.square, obj => {
            if (obj.props.id === this.currentPlayer) {
              const post = {}
              post.x = json.board.Intx + obj.props.x + (json.square.size / 4)
              post.y = json.board.Inty + obj.props.y + (json.square.size / 4)
              path.push(post)
            }
          })
        }
      }
    }

    square.forEach((val, index) => {
      square[index].forEach((val, index) => {
        if (!piece[this.playerChance].first && this.rollValue === 6) {
          // ++piece[this.playerChance].position;
          // TweenMax.to(piece[this.playerChance], 2, { x: json.board.Intx + val.x + (json.square.size / 4), y: val.y + json.board.Inty + (json.square.size / 4), onUpdate: () => this.setState({ piece }) })
          // piece[this.playerChance].position += this.rollValue;
          piece[this.playerChance].first = true;
          ++this.sixCount[this.playerChance];
        } else if (piece[this.playerChance].first && path.length) {
          TweenMax.to(piece[this.playerChance], 1.5, {
            ease: SteppedEase.config(path.length),
            bezier: { values: path },
            onUpdate: () => this.setState({ piece }), onComplete: () => {
              piece[this.playerChance].position += this.rollValue;
              ladderPresent = _.find(json.ladder, obj => (obj.start === piece[this.playerChance].position));
              SnakePresent = _.find(json.snake, obj => (obj.start === piece[this.playerChance].position));
              if (ladderPresent || SnakePresent) {
                (ladderPresent) ? this.ladder_snake_Present(ladderPresent.end, piece, 'ladder') : this.ladder_snake_Present(SnakePresent.end, piece, 'snake')
                this.setState({ piece });
              } else {
                this.PlayerStatus(piece);
              }
            }
          })
        }
      })
    })

    if (!ladderPresent && !SnakePresent && !path.length) {
      this.PlayerStatus(piece);
    }
  }
  rollAll() {
    this.reactDice.rollAll()
  }
  PlayerStatus(piece, ladderPresent = false) {
    console.log(this.rollValue != 6 && !ladderPresent, this.rollValue, ladderPresent);
    if (piece[this.playerChance].position != 100) {
      if (this.playerChance === this.userData.data.length - 1 && this.rollValue != 6 && !ladderPresent) {
        this.playerChance = 0
      } else if (this.rollValue != 6 && !ladderPresent) {
        this.playerChance++;
      }
    } else {
      console.log(`Player${this.playerChance} WON`);
      this.PlayerWin[this.playerChance] = 1;
      if (this.playerChance === this.userData.data.length - 1) {
        this.playerChance = 0
      } else {
        this.playerChance++;
      }
    }
    this.setState({ piece });
  }
  ladder_snake_Present(latestPosition, piece, value) {
    piece[this.playerChance].position = latestPosition;
    const currectValue = _.find(this.square, obj => obj.props.id === latestPosition).props;
    TweenMax.to(piece[this.playerChance], 2, { x: json.board.Intx + currectValue.x + (json.square.size / 4), y: currectValue.y + json.board.Inty + (json.square.size / 4), onUpdate: () => this.setState({ piece }), onComplete: () => this.PlayerStatus(piece, value === 'ladder' ? true : false) })
  }
  rollDoneCallback(num) {
    if (this.Bool) {
      this.rollValue = num;
      this.rollDice();
    }
    this.Bool = true;
  }
  render() {
    return (
      <div className='game'>
        <div className='playerDetail' style={{ position: json.board.position, height: 30, display: 'flex', top: 10, left: '50%', alignItems: 'center', transform: 'translateX(-50%)' }}>
          <div>Player:{this.userData.data[this.playerChance].name}</div>
          <div>SixCount:{this.sixCount[this.playerChance]}</div>
          <div>LadderCount:{this.ladderClimb[this.playerChance]}</div>
          <div>SnakeCount:{this.snakeBite[this.playerChance]}</div>
        </div>
        <div className='board' style={{ position: json.board.position, top: json.board.Inty, left: json.board.Intx }}>
          {this.square}
        </div>
        <div className='ladder'>
          {this.ladder}
        </div>
        <div className='snake'>
          {this.snake}
        </div>
        <div className='player' >
          {this.positionPiece()}
        </div>
        <div className='diceParent' style={{ position: json.diceParent.position, bottom: json.diceParent.Inty, left: json.diceParent.Intx }}>
          <ReactDice
            rollDone={this.rollDoneCallback} numDice={1} faceColor={this.userData.data[this.playerChance].color} dotColor={json.diceParent.dotColor}
            ref={dice => this.reactDice = dice} disableIndividual={false} rollTime={1}
          />
        </div>
      </div>
    )
  }
}

export { Board }
