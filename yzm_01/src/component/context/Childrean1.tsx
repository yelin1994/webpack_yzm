import {Context1} from './context';
import * as React from 'react';
import './index.scss'

export class Childrean1 extends React.Component <any, any> {
    constructor(props) {
        super(props);
    }
    render() {
        const {name} = this.context;
        return (<div className="content-pairent">{name}</div>
        )
    }
}
Childrean1.contextType = Context1