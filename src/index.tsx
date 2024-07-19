import ReactDOM  from "react-dom";
import {ActionTypes, App, FetchAction} from './components/App';
import { Reducer, applyMiddleware, combineReducers, createStore } from 'redux';
import { MapPoint } from './entities/MapPoint';
import { thunk } from 'redux-thunk';
import { Provider } from 'react-redux';

export interface StoreState{
  points: MapPoint[];
}

export const pointsReducer = (state: MapPoint[]=[], action: FetchAction) :MapPoint[]=>{
  switch (action.type) {
    case ActionTypes.FETCH:
      return action.payload;   
    default:
      return null;
  }
}

export const reducers = combineReducers<StoreState>({
  points: pointsReducer
});


const store = createStore(reducers, applyMiddleware(thunk));


ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.querySelector('#root'));
