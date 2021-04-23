import * as React from 'react';
import {Child} from './Child'
export function Context(props) {
    console.log(props);
    let childRef = React.useRef();
    handleClick = () => {
        console.log(childRef);
    }
    return (
        <div onClick={handleClick}>
            Context 
            <Child ref={childRef}></Child>
        </div>
    )
}
