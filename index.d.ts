type Reducer = (state: any, action: Action) => any;
interface Action {
    type: string;
    payload: any;
}
interface ReducersSource {
    [type: string]: Reducer;
}
interface Options {
    scopeName: string;
    initState: any,
    connectScopes?: {
      [scopeName: string]: any,
    };
    reducer?: Reducer;
    cache?: boolean;
}

export declare function connect(options: Options): (component: any) => void;
export declare function combineReducers(reducers: ReducersSource): Reducer;
export declare var RxStore: any;