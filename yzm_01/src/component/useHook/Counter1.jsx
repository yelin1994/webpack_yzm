import * as React from 'react';
import * as ReactDom from 'react-dom';
import {ProTableProps} from '@ant-design/pro-table';

const {useLayoutEffect, useEffect, useState} = React;

function useNumber() {
    let [number, setNumber] = useState(0);
    useEffect(() => {
        setInterval(() => {
            setNumber(number => number + 1)
        }, 1000)
    }, []);
    return [number, setNumber];
}

function Counter1() {
    let [number,setNumbers] = useNumber();
    return (
        <div><button onClick={()=>setNumbers(number + 1)
        }>{number}</button></div>
    )
}

function Counter2() {
    let [number,setNumber] = useNumber();
    return (
        <div><button onClick={()=>setNumber(number + 1)
    }>{number}</button></div>
    )
}

export function Counter() {
    return (
        <>
            <Counter1></Counter1>
            <Counter2></Counter2>
        </>
    )
}