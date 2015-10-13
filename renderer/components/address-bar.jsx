import React from 'react'
import OmniInput from './omni-input.jsx'

const AddressBar = props => (
    <div className="address-bar">
        <div className="back-button">
            <i className="fa fa-arrow-left"/>
        </div>
        <div className="forward-button">
            <i className="fa fa-arrow-right"/>
        </div>
        <i className="fa fa-refresh refresh-button"/>
        <OmniInput dispatch={props.dispatch}/>
    </div>
);

export default AddressBar;
