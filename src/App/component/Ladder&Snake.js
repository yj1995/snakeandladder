import React, { Component } from 'react'
import _ from 'lodash';
import { Line } from 'react-lineto';
import json from '../game.json'

class Ladder extends Component {
    constructor(props) {
        super(props)
        this.arr = [];
        this.draw = this.draw.bind(this);
        this.draw();
    }
    draw() {
        const { id, data, position } = this.props;
        _.each(position, (value) => {
            this.arr.push(_.find(data, obj => obj.props.id === value).props);
        });
        return this.arr;
    }

    render() {
        return (
            <React.Fragment>
                <Line x0={this.arr[0].x + json.board.Intx + 30} y0={this.arr[0].y + json.board.Inty + 30} x1={this.arr[1].x + json.board.Intx + 30} y1={this.arr[1].y + json.board.Inty + 30} borderColor={this.props.id.split("_")[0] === 'ladder' ? 'black' : 'orange'} borderWidth={5} />
            </React.Fragment>
        )
    }
}

export { Ladder };
