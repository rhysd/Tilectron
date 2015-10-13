import React from 'react'
import OmniInput from './omni-input.jsx'
import {closeTile} from '../actions'

const AddressBar = props => (
    <div className="address-bar">
        <div className="back-button">
            <i className="fa fa-arrow-left"/>
        </div>
        <div className="forward-button">
            <i className="fa fa-arrow-right"/>
        </div>
        <i className="fa fa-refresh icon-button"/>
        <OmniInput dispatch={props.dispatch}/>
        <i className="fa fa-times icon-button" onClick={() => props.dispatch(closeTile(props.tile_id))}/>
    </div>
);

export default AddressBar;
