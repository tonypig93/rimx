export { connect, RxStore } from './reactBinding';

function combineReducers(reducers) {
    return function (state, action) {
        var type = action.type;
        if (typeof reducers[type] === 'function') {
            return reducers[type](state, action);
        }
        throw new Error('Expected the reducer to be a function');
    };
}

export { combineReducers };
