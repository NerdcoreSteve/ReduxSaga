require('whatwg-fetch')
require('babel-polyfill')

const
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
            case 'GOT_POKEMON':
                return action.pokemon
            default:
                return state
        }
    },
    pokemonSaga = function* () {
        const
            response = yield call(
                fetch,
                '/pokemon',
                {
                    method: 'get',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                }),
            json = yield call([response, response.json])

        yield put({
            ...json,
            type: 'GOT_POKEMON',
        })
    },
    messageSaga = function* () {
        const
            response = yield call(
                fetch,
                '/message',
                {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data: {
                            message: store.getState()
                        }
                    })
                }),
            json = yield call([response, response.json])

        yield put({
            ...json,
            type: 'MESSAGE_RECIEVED',
        })
    },
    rootSaga = function* () {
        yield takeEvery('SEND_MESSAGE', messageSaga)
        yield takeEvery('GET_POKEMON', pokemonSaga)
    },
    store = createStore(reducer, applyMiddleware(sagaMiddleware)),
    render = () =>
        ReactDOM.render(
            <div>
                <p>{store.getState()}</p>
                <input
                    type="text"
                    onChange = {({target:{value: text}}) => store.dispatch({type: 'ADD_TEXT', text})}
                    value = {store.getState()}
                    onKeyPress=
                        {e => { if (e.key === 'Enter') store.dispatch({type: 'SEND_MESSAGE'}) } }/>
                <button
                    onClick={() => store.dispatch({type: 'GET_POKEMON'})}
                    type="button">
                        Get Pokemon
                </button>
            </div>,
            document.getElementById('root'))

sagaMiddleware.run(rootSaga)
store.subscribe(render)
render()
