
import ReactDOM  from "react-dom";
import {App, FetchAction} from './components/App';
import { CoordinatesHelper } from './coordinates/CoordinatesHelper';
import { Reducer, applyMiddleware, combineReducers, createStore } from 'redux';
import { MapPoint } from './entities/MapPoint';
import { thunk } from 'redux-thunk';
import { Provider } from 'react-redux';
//import '../testdata/Only-points.gpx'

export interface StoreState{
  points: MapPoint[];
}

export const pointsReducer = (state: MapPoint[]=[], action: FetchAction) :MapPoint[]=>{
  return action.payload;
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
