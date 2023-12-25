import * as React from 'react';
import FlextTest from './FlexTest';
// import {Select} from 'antd'

export class App extends React.Component {
  componentDidMount() {
    console.log('-------', this);
  }

  render() {
    return <FlextTest />;
  }
}
