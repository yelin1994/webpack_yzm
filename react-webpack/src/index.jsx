import React from 'react'
import './style.less'
import xin from './images/xin.jpg'
// import ReactDom from 'react-dom'
import { createRoot } from 'react-dom/client';
if (module.hot) {
  module.hot.accept()
}
const App = () => {
  return (
    <div>
      hello
      <img width="40" src={xin} />
    </div>
  )
}
const root = createRoot(document.getElementById('app'));
root.render(<App />)
// ReactDom.render(App, document.getElementById('app'))