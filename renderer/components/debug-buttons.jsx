import React from 'react'
import {splitVertical, splitHorizontal} from '../actions'

const DebugButtons = props => (
    <div className="debug-buttons">
        <button type="button" onClick={() => props.dispatch(splitVertical())}>
            {'+ '}<i className="fa fa-arrows-h"/>
        </button>
        <button type="button" onClick={() => props.dispatch(splitHorizontal())}>
            {'+ '}<i className="fa fa-arrows-v"/>
        </button>
        <div className="spacer">
        </div>
        <div className="menu-button">
            <i className="fa fa-bars"/>
        </div>
    </div>
);
export default DebugButtons;
