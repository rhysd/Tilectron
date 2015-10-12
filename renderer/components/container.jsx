import React from 'react'
import Tile from './tile.jsx'
import {SplitType} from '../container-node'
import TileLeaf from '../tile-leaf'

// TODO:
// Use stateless container (react v0.14)
export default class Container extends React.Component {
    getDirection() {
        return this.props.knot.split_type === SplitType.Vertical ?
                    'row' :
                    'column';
    }

    getChildStyle() {
        if (this.props.knot.split_type === SplitType.Vertical) {
            return {
                width: '50%',
                height: '100%'
            };
        } else {
            return {
                width: '100%',
                height: '50%'
            };
        }
    }

    renderTree(tree) {
        if (tree instanceof TileLeaf) {
            return <Tile leaf={tree} current_id={this.props.current_id} style={this.getChildStyle()}/>;
        } else {
            return <Container knot={tree} current_id={this.props.current_id} style={this.getChildStyle()}/>;
        }
    }

    render() {
        const s = {
            ...this.props.style,
            flexDirection: this.getDirection()
        };

        return (
            <div className="knot" style={s}>
                {this.renderTree(this.props.knot.left)}
                {this.renderTree(this.props.knot.right)}
            </div>
        );
    }
}
