import * as React from 'react';
const reducer = (state, action) => {
    if (action.type === 'add') {
        return state + 1;
    } else {
        return state;
    }
}
export function App() {
    const [number, setnumber] = React.useReducer(reducer, 0);
    return (
        <div onClick= {() => {setnumber({type: 'add'})}}>{number}</div>
    )
}



