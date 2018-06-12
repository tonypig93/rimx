export interface Action {
    type: string;
    payload: any;
}
  
export type Reducer = (state: any, action: Action) => any;