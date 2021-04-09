import * as React from 'react';
import './flex.scss';
import './index';
import  moment, {duration} from 'moment'

export class FlextTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            arr: Array(100).fill(1),
        }
    }
    componentDidMount() {
        // console.log(',,,,,,,,,,', duration)
    }
    render() {
        const {arr} = this.state;
       return (
           <div className="felxContainer">
               {
                   arr.map((item, index) => {
                     return <div className="felxItem" key={index}> {item}</div>
                   })
               }
           </div>
       ) 
    }
}