// import {App} from '../component/App';
import * as ReactDOM from 'react-dom';
import React from 'react';
import { App } from '../component/css01/App';
// import {App} from '../component/context/App'
// import {App} from '../component/useHook/App'
// import {App} from '../../ant/App'
// import '../styles/app.scss';
// import {App} from '../component/App';
// import {App} from '../component/mobx01/App'
// import {sayHello, sayWorld} from '../utils/index';
// import '../component/mobx01/index';

// class App extends React.Component {
//     render() {
//         return <div className="container" onClick={sayHello}> hello world as
//                 <img src={logo}></img>
//             </div>
//     }
// }

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
