
import * as React  from 'react'

const {useState, useMemo, useCallback} = React;
function SubCounter(props) {
  console.log('sub', props)
  const {onClick, data} = props;
  return (
    <button onClick={onClick}>{data.number}</button>
  )
}

const SubCounters = React.memo(SubCounter)

export function Counter() {
  console.log('couner render');
  const [name, setName] = useState('计算器');
  const [number, setNumber] = useState(0);
  const data = useMemo(() => ({number}), [number])
  const addClick = useCallback(() => {
    setNumber(number + 1)
  }, [number])

  return (
    <>
      <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
      <SubCounters data={data} onClick={addClick}></SubCounters>
    </>
  )
}