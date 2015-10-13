import React from 'react'

const AddressBar = props => (
    <div className="address-bar">
        <div className="back-button">
            <i className="fa fa-arrow-left"/>
        </div>
        <div className="forward-button">
            <i className="fa fa-arrow-right"/>
        </div>
        <i className="fa fa-refresh refresh-button"/>
        <input className="address-input" type="search"/>
    </div>
);

export default AddressBar;