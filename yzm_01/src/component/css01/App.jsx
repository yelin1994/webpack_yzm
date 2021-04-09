import {FlextTest} from './FlexTest';
import * as React from 'react';
import {Select} from 'antd'

export class App extends React.Component {
    componentDidMount() {
        console.log('-------', this)
    }
    render() {
        return <FlextTest></FlextTest>
    }
}