import * as React from 'react';
import {observer} from 'mobx-react';

@observer
export class Bar extends React.Component <any, any>{
    render() {
        console.log(this.props)
        const {queue} = this.props;
        return <span>{queue.length}</span>
    }
}