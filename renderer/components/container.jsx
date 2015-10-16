import React, {PropTypes, Component} from 'react';
import Tile from './tile.jsx';
import {ContainerKnot, TileLeaf, SplitType} from '../tile-tree';

export default class Container extends Component {
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
        const {current_id, pages, dispatch} = this.props;
        const common_props = {
            style: this.getChildStyle(),
            current_id,
            pages,
            dispatch
        };

        if (tree instanceof TileLeaf) {
            return <Tile leaf={tree} {...common_props}/>;
        } else {
            return <Container knot={tree} {...common_props}/>;
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

Container.propTypes = {
    current_id: PropTypes.number,
    dispatch: PropTypes.func,
    knot: PropTypes.instanceOf(ContainerKnot),
    pages: PropTypes.object,
    style: PropTypes.object
};
