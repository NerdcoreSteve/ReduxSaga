require('whatwg-fetch')
require('babel-polyfill')

const
    R = require('ramda'),
    tap = x => {console.log(x); return x},
    React = require('react'),
    ReactDOM = require('react-dom'),
    {createStore, applyMiddleware} = require('redux'),
    {default: createSagaMiddleware, takeEvery, effects: {put, call}} = require('redux-saga'),
    sagaMiddleware = createSagaMiddleware(),
    reducer = (state = '', action) => {
        switch(action.type) {
            case 'ADD_TEXT':
                return action.text
            case 'MESSAGE_RECIEVED':
                return action.response
            default:
                return state
        }
    },
    messageSaga = function* () {
        yield put({
            type: 'MESSAGE_RECIEVED',
            response: 'this is a response'
        })
    },
    messageSender = function* () {
        yield takeEvery('SEND_MESSAGE', messageSaga)
    },
    store = createStore(reducer, applyMiddleware(sagaMiddleware)),
    render = () =>
        ReactDOM.render(
            <div>
                <p>{store.getState()}</p>
                <input
                    type="text"
                    onChange={({target:{value: text}}) => store.dispatch({type: 'ADD_TEXT', text})}
                    value={store.getState()}/>
                <button
                    onClick={() => store.dispatch({type: 'SEND_MESSAGE'})}
                    type="button">
                        Send Message
                </button>
            </div>,
            document.getElementById('root'))

sagaMiddleware.run(messageSender)
store.subscribe(render)
render()
