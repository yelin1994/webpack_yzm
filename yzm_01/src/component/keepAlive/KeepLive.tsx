import React, { createContext, useState } from 'react'
const { Provider, Consumer } = createContext(null)

const withScope = WrappedComponent => props => (
  <Consumer>{ keep => <WrappedComponent  {...props} keep={keep} />}</Consumer>
)

export const AliveScope = () => {
  const [nodes, setNodes] = useState({})
  const [state, setSSte] = useState({})
  return (
    <div></div>
  )
}