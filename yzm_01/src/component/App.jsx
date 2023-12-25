import React from 'react';
import '../styles/app.scss';
import logo from '../images/ssd.jpeg'


export class App extends React.Component {

    constructor(props) {
        super(props);
        this.dispatcherPopup = this.dispatcherPopup.bind(this);
        this.state = {
            Popup: null
        }
        console.log('window', window)
    }
    dispatcherPopup = () => {
        import ('./Popup').then(({Popup}) => {
            this.setState({
                Popup
            })
        });
    }
    render() {
        const {Popup} = this.state;
        return (<div>
            hello
            <img src={logo} style={{width: '100px', height: '100px', position:'relative'}}></img>
            <button onClick={this.dispatcherPopup}>show popup</button>
            {Popup ? <Popup></Popup> : null}
            </div>
        )
    }
}