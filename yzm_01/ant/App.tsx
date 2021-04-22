import * as React from 'react';
import 'antd/dist/antd.css';
import {BrowserRouter, Route} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {Login} from './login/Login';
import {Context} from './src/Context'

let browserHistory = createBrowserHistory();
export class App extends React.Component {
    render() {
        return <BrowserRouter history={browserHistory}>
                <Route exact path='/'>
                    <Login></Login>
                </Route>
                <Route exact  path='/content/:id'>
                    <Context></Context>
                </Route>    
        </BrowserRouter>
    }
}

