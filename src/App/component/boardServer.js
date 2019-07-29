import React, { Component } from 'react'
import { Square } from './Square';
import { Piece } from './Piece';
import { socket } from '../Parent';
import _ from 'lodash';
import { TweenMax } from "gsap/TweenMax";
import ReactDice from 'react-dice-complete';
import json from '../game.json';
import 'react-dice-complete/dist/react-dice-complete.css';
import { Ladder } from './Ladder&Snake';

class boardServer extends Component {
  constructor(props) {
    super(props)
    window.display = this;
    this.PlayerWin = [];
    this.userData = this.props.location;
    this.firstDiceRollBool = false;
    this.ladder = [];
    this.snake = [];
    this.ladderClimb = [];
    this.snakeBite = [];
    this.tilePosition = [];
    this.rollValue = 0;
    this.currentPlayer;
    this.sixCount = [];
    this.tile = [];
    this.playerChance = 0;
    this.state = {
      piece: []
    };
    this.setTile = this.setTile.bind(this);
    this.rollDice = this.rollDice.bind(this);
    this.setTilePosition = this.setTilePosition.bind(this);
    this.setPiece = this.setPiece.bind(this);
    this.setPiecePosition = this.setPiecePosition.bind(this);
    this.rollDoneCallback = this.rollDoneCallback.bind(this);
    this.drawLadder = this.drawLadder.bind(this);
    this.drawSnake = this.drawSnake.bind(this);
    this.findLadderAndSnakePresent = this.findLadderAndSnakePresent.bind(this);
    this.currectPlayerStatus = this.currectPlayerStatus.bind(this);
  }

  componentDidMount() {
    this.setTilePosition();
    socket.on(`${this.userData.room}_movement`, (data) => {
      let dataArr = Object.keys(data).map(function (key) {
        return data[key];
      });
      this.setState({ piece: dataArr });
      this.playerChance = _.findIndex(this.state.piece, (data) => { return data.chance == true });

    })
    this.setTile();
    this.drawLadder();
    this.drawSnake();
    this.setPiece();
  }

  setTilePosition() {
    socket.emit('movement', { data: this.userData.data, room: +this.userData.room });
    let x = 0;
    let y = 0;
    for (let i = json.board.row - 1; i >= 0; i--) {
      y = i * json.square.size;
      x = 0;
      this.tilePosition[i] = [];
      if (i % 2 === 0) {
        for (let j = 0; j < json.board.col; j++) {
          x = j * json.square.size;
          if (j % 2 === 0) {
            this.tilePosition[i].push({
              x: x,
              y: y,
              color: json.square.color1,
              fontColor: json.square.font1
            });
          } else {
            this.tilePosition[i].push({
              x: x,
              y: y,
              color: json.square.color2,
              fontColor: json.square.font2
            });
          }
        }
      } else {
        for (let j = json.board.col - 1; j >= 0; j--) {
          x = j * json.square.size;
          if (j % 2 === 0) {
            this.tilePosition[i].push({
              x: x,
              y: y,
              color: json.square.color2,
              fontColor: json.square.font2
            });
          } else {
            this.tilePosition[i].push({
              x: x,
              y: y,
              color: json.square.color1,
              fontColor: json.square.font1
            });
          }
        }
      }
    }
  }

  setTile() {
    let count = 101;
    let row = 0;
    socket.emit('new-player', { data: this.userData.data[this.userData.data.length - 1], mySocketId: this.userData.data.length - 1, room: +this.userData.room });
    this.tilePosition.forEach((val, index) => {
      row++;
      this.tilePosition[index].forEach((val, index) => {
        count--;
        this.tile.push(<Square key={`square_${count}`} x={val.x} y={val.y} id={count} color={val.color} fontColor={val.fontColor} />);
        val.point = count;
        val.row = row;
      })
    })
    return this.tile;
  }

  drawLadder() {
    json.ladder.forEach((val, index) => {
      this.ladder.push(<Ladder key={`ladder_${index}`} id={`ladder_${index}`} data={this.tile} position={val} className='ladder' />)
    });
    return this.ladder;
  }

  drawSnake() {
    json.snake.forEach((val, index) => {
      this.snake.push(<Ladder key={`snake_${index}`} id={`snake_${index}`} data={this.tile} position={val} className='snake' />)
    });
    return this.snake;
  }

  setPiece() {
    const arr = [];
    for (let i = 0; i < this.userData.data.length; i++) {
      arr.push({
        x: json.Piece.width - (json.Piece.size + ((json.Piece.size + 5) * i)),
        y: json.Piece.Inty,
        scale: 0,
        position: 0
      })
      this.sixCount[i] = 0;
      this.ladderClimb[i] = 0;
      this.snakeBite[i] = 0;
    }
    this.setState({
      piece: arr
    })
  }

  setPiecePosition() {
    const piecesArr = [];
    this.state.piece.forEach((val, index) => {
      piecesArr.push(
        <Piece key={`piece_${index}`} id={this.userData.data[index].inital} x={val.x} y={val.y} color={this.userData.data[index].color} scale={val.scale} first={false} />
      )
    });
    return piecesArr;
  }

  rollDoneCallback(num) {
    if (this.firstDiceRollBool) {
      document.querySelector('.diceParent').style['pointer-events'] = 'none';
      this.rollValue = num;
      this.rollDice();
    }
    this.firstDiceRollBool = true;
  }

  rollDice() {
    const piece = this.state.piece;
    const square = this.tilePosition;
    let currectValue = 0;
    let ladderPresent;
    let SnakePresent;
    let sixBool = false;
    let path = [];
    if (piece[this.playerChance].first) {
      if (this.rollValue === 6) {
        ++this.sixCount[this.playerChance]
      }
      currectValue = piece[this.playerChance].position + this.rollValue;
      if (currectValue <= 100) {
        this.currentPlayer = piece[this.playerChance].position;
        for (let i = this.rollValue; i > 0; i--) {
          ++this.currentPlayer;
          _.find(this.tile, obj => {
            if (obj.props.id === this.currentPlayer) {
              const post = {}
              post.x = obj.props.x + (json.square.size / 8.5)
              post.y = obj.props.y + (json.square.size / 8.5)
              path.push(post)
            }
          })
        }
        piece[this.playerChance].position += this.rollValue;
      }
    }

    square.forEach((val, index) => {
      square[index].forEach((val, index) => {
        if (!piece[this.playerChance].first && this.rollValue === 6 && val.row === 10 && val.point === 1) {
          piece[this.playerChance].position = 1;
          sixBool = true;
          document.querySelector('.overlayer').style.background = 'rgba(158, 158, 158, 0)';
          document.querySelector('.overlayer').style.opacity = 0;
          piece[this.playerChance].x = val.x + (json.square.size / 8.5);
          piece[this.playerChance].y = val.y + (json.square.size / 8.5);
          TweenMax.to(piece[this.playerChance], 0.5,
            {
              scale: 1,
              onUpdate: () => {
                socket.emit('movement', {
                  data: piece[this.playerChance], mySocketId: this.playerChance, room: +this.props.location.room
                });
              },
              onComplete: () => {
                this.currectPlayerStatus(piece);
                document.querySelector('.diceParent').style['pointer-events'] = 'auto';
              }
            })
          piece[this.playerChance].first = true;
          ++this.sixCount[this.playerChance];
        } else if (piece[this.playerChance].first && path.length) {
          document.querySelector('.overlayer').style.background = 'rgba(158, 158, 158, 0)';
          document.querySelector('.overlayer').style.opacity = 0;
          TweenMax.to(piece[this.playerChance], 2, {
            ease: SteppedEase.config(path.length),
            bezier: { values: path },
            onUpdate: () => {
              socket.emit('movement', {
                data: piece[this.playerChance], mySocketId: this.playerChance, room: +this.props.location.room
              });
            },
            onComplete: () => {
              ladderPresent = _.find(json.ladder, obj => (obj.start === piece[this.playerChance].position));
              SnakePresent = _.find(json.snake, obj => (obj.start === piece[this.playerChance].position));
              if (ladderPresent || SnakePresent) {
                (ladderPresent) ? this.findLadderAndSnakePresent(ladderPresent.end, piece, 'ladder') : this.findLadderAndSnakePresent(SnakePresent.end, piece, 'snake')
                this.setState({ piece });
                if (ladderPresent) {
                  ++this.ladderClimb[this.playerChance]
                } else {
                  ++this.snakeBite[this.playerChance]
                }
              } else {
                this.currectPlayerStatus(piece);
                document.querySelector('.diceParent').style['pointer-events'] = 'auto';
              }
            }
          })
        }
      })
    })

    if (!ladderPresent && !SnakePresent && !path.length && !sixBool) {
      setTimeout(() => {
        this.currectPlayerStatus(piece);
        document.querySelector('.diceParent').style['pointer-events'] = 'auto';
      }, 250)
    }
  }

  currectPlayerStatus(piece, ladderPresent = false) {
    if (piece[this.playerChance].position != 100) {
      if (this.playerChance === this.state.piece.length - 1 && this.rollValue != 6 && !ladderPresent) {
        this.playerChance = 0;
        socket.emit('movement', {
          data: piece[this.playerChance], mySocketId: this.playerChance, room: +this.props.location.room
        });
      } else if (this.rollValue != 6) {
        if (!ladderPresent) {
          ++this.playerChance;
          socket.emit('movement', {
            data: piece[this.playerChance], mySocketId: this.playerChance, room: +this.props.location.room
          });
        }
      }
    } else {
      alert(`Player${this.playerChance} WON`);
      this.PlayerWin[this.playerChance] = 1;
      if (this.playerChance === this.userData.data.length - 1) {
        for (let i = 0; i < this.userData.data.length; i++) {
          if (this.PlayerWin[this.playerChance] != 1) {
            this.playerChance = i;
            break;
          }
        }
      } else {
        this.playerChance++;
        if (this.PlayerWin[this.playerChance] == 1) {
          this.playerChance++;
          if (this.playerChance === this.userData.data.length - 1) {
            for (let i = 0; i < this.userData.data.length; i++) {
              if (this.PlayerWin[this.playerChance] != 1) {
                this.playerChance = i;
                break;
              }
            }
          }
        }
      }
    }
    this.setState({ piece });
    document.querySelector('.overlayer').style.background = 'rgba(158, 158, 158, 0.8)';
    document.querySelector('.overlayer').style.opacity = 1;
  }

  findLadderAndSnakePresent(latestPosition, piece, value) {
    piece[this.playerChance].position = latestPosition;
    const currectValue = _.find(this.tile, obj => obj.props.id === latestPosition).props;
    if (value === 'ladder') {
      TweenMax.to(piece[this.playerChance], 2, {
        x: currectValue.x + (json.square.size / 8.5),
        y: currectValue.y + (json.square.size / 8.5),
        onUpdate: () => {
          socket.emit('movement', {
            data: piece[this.playerChance], mySocketId: this.playerChance, room: +this.props.location.room
          });
        },
        onComplete: () => {
          this.currectPlayerStatus(piece, value === 'ladder' ? true : false)
          document.querySelector('.diceParent').style['pointer-events'] = 'auto';
        }
      })
    } else {
      TweenMax.to(piece[this.playerChance], 2, {
        scale: 0,
        onUpdate: () => {
          socket.emit('movement', {
            data: piece[this.playerChance], mySocketId: this.playerChance, room: +this.props.location.room
          });
        },
        onComplete: () => {
          piece[this.playerChance].x = currectValue.x + (json.square.size / 8.5);
          piece[this.playerChance].y = currectValue.y + (json.square.size / 8.5);
          TweenMax.to(piece[this.playerChance], 2, {
            scale: 1,
            onUpdate: () => {
              socket.emit('movement', {
                data: piece[this.playerChance], mySocketId: this.playerChance, room: +this.props.location.room
              });
            },
            onComplete: () => {
              this.currectPlayerStatus(piece, value === 'ladder' ? true : false);
              document.querySelector('.diceParent').style['pointer-events'] = 'auto';
            }
          })
        }
      })
    }
  }

  render() {
    return (
      <div className='game' style={{ position: json.board.position, width: '100%', height: '100%' }}>
        <div className='board' style={{ position: json.board.position, width: json.square.size * 10, height: json.square.size * 10, left: 0, right: 0, top: 0, bottom: 0, margin: 'auto', fontFamily: 'fantasy', fontSize: 24 }}>
          <div>
            {this.tile}
          </div>
          <div className='ladder' style={{ position: json.board.position }}>
            {this.ladder}
          </div>
          <div className='snake' style={{ position: json.board.position }}>
            {this.snake}
          </div>
          <div className='player' style={{ position: json.board.position }}>
            {this.setPiecePosition()}
          </div>
          <div className='overlayer' style={{ position: json.diceParent.position, width: json.square.size * 10, height: json.square.size * 10, background: 'rgba(158,158,158,0.8)', zIndex: 1000, display: this.state.piece.length ? (this.state.piece[this.userData.admin].chance ? 'block' : 'none') : 'none' }}>
            <div className='diceParent' style={{ position: json.diceParent.position, left: '50%', top: '50%', transform: 'translate(-50%,-50%)', fontSize: 30, fontFamily: 'monospace', color: 'white', textAlign: 'center' }}>
              <div>Player:{this.userData.data[this.userData.admin].name}</div>
              <div>SixCount:{this.sixCount[this.userData.admin]}</div>
              <div>LadderCount:{this.ladderClimb[this.userData.admin]}</div>
              <div>SnakeCount:{this.snakeBite[this.userData.admin]}</div>
              <ReactDice
                rollDone={this.rollDoneCallback} numDice={1} faceColor={this.userData.data[this.userData.admin].color} dotColor={json.diceParent.dotColor}
                ref={dice => this.reactDice = dice} rollTime={0.2}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export { boardServer }
