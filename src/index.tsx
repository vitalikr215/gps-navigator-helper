import ReactDOM  from "react-dom";
import {App} from './components/App';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import { Provider } from 'react-redux';
import {pointsReducer } from "./actions/reducers";
import { MyMapProps } from "./props/MyMapProps";

export interface StoreState{
  pointsInfo: MyMapProps;
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


