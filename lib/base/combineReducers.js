export function combineReducers(reducers) {
    return (state, action) => {
        const type = action.type;
        if (typeof reducers[type] === 'function') {
            return reducers[type](state, action);
        }
        console.warn('reducer is not a function');
        return state;
    };
}
