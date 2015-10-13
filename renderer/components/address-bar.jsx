import React from 'react'
import OmniInput from './omni-input.jsx'
import {splitVertical, splitHorizontal, closeTile} from '../actions'

const AddressBar = props => (
    <div className="address-bar">
        <div className="split leftside-button" onClick={() => props.dispatch(splitVertical())}>
            {'+ '}<i className="fa fa-arrows-h"/>
        </div>
        <div className="split rightside-button" onClick={() => props.dispatch(splitHorizontal())}>
            {'+ '}<i className="fa fa-arrows-v"/>
        </div>
        <div className="leftside-button">
            <i className="fa fa-arrow-left"/>
        </div>
        <div className="rightside-button">
            <i className="fa fa-arrow-right"/>
        </div>
        <i className="fa fa-refresh icon-button"/>
        <OmniInput dispatch={props.dispatch}/>
        <i className="fa fa-times icon-button" onClick={() => props.dispatch(closeTile(props.tile_id))}/>
    </div>
);

export default AddressBar;
