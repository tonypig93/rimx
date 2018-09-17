export interface Action {
  type: string;
  payload?: any;
}

export type Reducer = (state: any, action: Action) => any;

export interface ScopeState {
  __scopeId: number;
  __cached: boolean;
  __log: boolean;
  __reducer?: Reducer;
  state: Object;
}
