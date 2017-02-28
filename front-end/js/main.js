require('whatwg-fetch')
require('babel-polyfill')

const
    R = require('ramda'),
    tap = x => {console.log(x); return x},
    React = require('react'),
    ReactDOM = require('react-dom'),
    {createStore, applyMiddleware} = require('redux'),
    {default: createSagaMiddleware, takeEvery, effects: {put, call}} = require('redux-saga'),
    reducer = (state = '', action) => {
        switch(action.type) {
            case 'ADD_TEXT':
                return action.text
            default:
                return state
        }
    },
    store = createStore(reducer, applyMiddleware(createSagaMiddleware())),
    render = () =>
        ReactDOM.render(
            <div>
                <p>{store.getState()}</p>
                <input
                    type="text"
                    onChange={({target:{value: text}}) => store.dispatch({type: 'ADD_TEXT', text})}/>
                <button type="button">Send Message</button>
            </div>,
            document.getElementById('root'))

store.subscribe(render)
render()
