import * as React from 'react';
import {observer} from 'mobx-react';
type Props = {
    store: Store;
}

type Store = {
    cache: string| number;
    refresh: Function;
    total: string | number;
}

@observer
export class App extends React.Component<Props, any> {
    handleClick = () => {
        console.log(this.props.store)
        this.props.store.refresh()
    }
    render() {
        let {cache, total} = this.props.store;
        console.log('12312')
        return (<div>
            <button onClick={this.handleClick}>点击 + 1</button>
            当前数值:
            {cache} {total}
        </div>
        )
    }

    // render() {
    //     return (<span>Seconds passed: { this.props.timerData.secondsPassed } </span> )
    // }
}