import React, { Component } from 'react'
import _ from 'lodash';
import { Line } from 'react-lineto';

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
                <Line x0={this.arr[0].x  + 30} y0={this.arr[0].y + 30} x1={this.arr[1].x + 30} y1={this.arr[1].y + 30} borderColor={this.props.id.split("_")[0] === 'ladder' ? 'black' : 'orange'} borderWidth={5} within={this.props.className} />
            </React.Fragment>
        )
    }
}

export { Ladder };
