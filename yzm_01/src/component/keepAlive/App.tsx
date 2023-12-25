import React, { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      count: {count}
      <button onClick={() => { setCount(count => count + 1)}}></button>
    </div>
  )
}

export const App = () => {

}