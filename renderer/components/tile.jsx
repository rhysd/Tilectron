import React from 'react'

// TODO:
// Use stateless container (react v0.14)
export default class Tile extends React.Component {
    render() {
        return (
            <div className="tile" style={this.props.style}>
                {this.props.leaf.id}
            </div>
        );
    }
}
