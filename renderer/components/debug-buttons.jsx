import React from 'react'
import {splitVertical, splitHorizontal} from '../actions'

const DebugButtons = props => (
    <div className="debug-buttons">
        <button type="button" onClick={() => props.dispatch(splitVertical())}>
            Vertical
        </button>
        <button type="button" onClick={() => props.dispatch(splitHorizontal())}>
            Horizontal
        </button>
    </div>
);
export default DebugButtons;
