import * as React from 'react';
import {Context1} from './context';
import {Childrean1} from './Childrean1'

export class App extends React.Component <any, any>{
    constructor(props, state) {
        super(props, state);
        this.state = {
            contextValue: {
                name: 'yyey'
            },
            value: 0
        }
    }

    handleClick = () => {
        this.setState((preState) => {
            return {
                value: preState.value + 1
            }
        })
        this.setState((preState) => {
            return {
                value: preState.value + 1
            }
        })
        // setTimeout(() => {
        //     this.setState((preState) => {
        //         return {
        //             value: preState.value + 1
        //         }
        //     })
        //     console.log(this.state.value)
        //     this.setState((preState) => {
        //         return {
        //             value: preState.value + 1
        //         }
        //     })
        //     console.log(this.state.value)
        // }, 0)
    }

    componentDidUpdate() {
        console.log('rerender');
    }
    render() {
        return (
            <Context1.Provider value={this.state.contextValue}>
                <Childrean1></Childrean1>
                 <button onClick={this.handleClick}/>
                 {this.state.value}
            </Context1.Provider>
        )
    }
}