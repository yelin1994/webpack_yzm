// import {App} from './component/App.jsx';
// import ReactDOM from 'react-dom';
// import React from 'react';
// import '../styles/app.scss';
// import {App} from '../component/App';

const React = require('react');
const logo = require('./img/ssd.jpeg');
require('../styles/app.scss');
class App extends React.Component {
    render() {
        return <div className="container"> 
                hello world as
                <img src="./img/ssd.jpeg"></img>
            </div>
    }
}

module.exports = <App/>;
