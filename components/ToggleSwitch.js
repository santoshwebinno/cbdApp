import React, { useEffect, useState } from 'react';

const ToggleSwitch = (props) => {
    return (
        <>
        {
            props.checked 
            ?
            (<label className="switch active" id={props.id} onClick={(ev) => props.renderSelectPro(ev, props.id)}>
                {/* <input type="checkbox" checked={check}  onChange={(ev)=> setCheck(!check)}/> */}
                <span className="slider"></span>
            </label>)
            :
            (<label className="switch" id={props.id} onClick={(ev) => props.renderSelectPro(ev, props.id)}>
               <span className="slider"></span>
            </label>)
        }
        </>  
    );
}

export default ToggleSwitch;