import { renderComponent } from './react-dom'

class Component {
  constructor(props = {}) {
    this.state = {}
    this.props = props
  }

  setState(stateChange){
    Object.assign(state, stateChange)
    renderComponent(this)
  }

  render() {
    
  }
}

export  default Component