import ReactDOM  from "react-dom";
import {ActionTypes, App, FetchAction} from './components/App';
import { Reducer, applyMiddleware, combineReducers, createStore } from 'redux';
import { MapPoint } from './entities/MapPoint';
import { thunk } from 'redux-thunk';
import { Provider } from 'react-redux';
import { MyMapProps } from "./props/MyMapProps";

export interface StoreState{
  pointsInfo: MyMapProps;
}

export const pointsReducer = (state: MyMapProps, action: FetchAction) :MyMapProps=>{
  switch (action.type) {
    case ActionTypes.FETCH:
      return action.payload;   
    default:
      const defaultInfo: MyMapProps = {locations: [], drawRoute: false, 
        routeSegments:[], segmentsStartEndPoints:[]};
      return defaultInfo;
  }
}

export const reducers = combineReducers<StoreState>({
  pointsInfo: pointsReducer
});


const store = createStore(reducers, applyMiddleware(thunk));


ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.querySelector('#root'));
