import * as React from 'react';
import {Counter} from  './Counter1'
// import {Counter} from './State'
// import {Counter} from './Counter2'
// const reducer = (state, action) => {
//     if (action.type === 'add') {
//         return state + 1;
//     } else {
//         return state;
//     }
// }
export function App() {
    // const [number, setnumber] = React.useReducer(reducer, 0);
    return (
        // <div onClick= {() => {setnumber({type: 'add'})}}>{number}</div>
        <Counter></Counter>
    )
}



