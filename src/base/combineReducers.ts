import { Reducer, Action } from './types';

interface ReducersSource {
  [type: string]: Reducer;
}

export function combineReducers(reducers: ReducersSource) {
  return (state, action: Action) => {
    const type = action.type;
    if (typeof reducers[type] === 'function') {
      return reducers[type](state, action);
    }
    console.warn('reducer is not a function');
    return state;
  };
}
