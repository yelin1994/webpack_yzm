import * as React from 'react';

const {useState} = React;
/**
 * Hook 内部使用 Object.is 来比较新/旧 state 是否相等
 * 与 class 组件中的 setState 方法不同，如果你修改状态的时候，传的状态值没有变化，则不重新渲染
* 与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象。你可以用函数式的 setState 结合展开运算符来达到合并更新对象的效果。
 */
export function Counter(props) {
    let [number, setNumber] = useState(0);
    let [counter,setCounter] = useState({name:'计数器',number:0});
    function getInitState()  {
        return {age: props.age}
    }

    let [age, setAge] = useState(getInitState);
    function lazy() {
        setTimeout(() => {
            setNumber(number => number + 1)
        }, 100)
    }
    return (
        <>
            <p>{number}</p>
            <button onClick={lazy}>lazy</button>
            <p>{counter.name}:{counter.number}</p>
            <button onClick={()=>setCounter({...counter,number:counter.number+1})}>+</button>
            <button onClick={()=>setCounter(counter)}>++</button>
        </>
    )
}