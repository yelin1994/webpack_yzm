import {observable, action, computed, makeObservable} from 'mobx';
import * as React from 'react';
import {App} from './App';
import * as ReactDom from 'react-dom';


// const store = observable({
//     cache: 1,
//     refresh() {
//         this.cache++;
//     },
//     get total() {
//             return this.cache + 1;
//     }
// }, {refresh: action})

class Store {
    @observable cache = 1;
    @action refresh() {
        this.cache++;
    }
    @computed get total() {
        return this.cache + 1;
    }
    constructor() {
        makeObservable(this)
    }

}
let store = new Store();


// ReactDom.render(<App cache={store.cache} refresh={store.refresh}></App>, document.getElementById('root'));

// setInterval(() => store.cache++, 1000)



ReactDom.render(<App store={store}/>, document.getElementById('root'));