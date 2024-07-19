import React, { ReactNode } from 'react';
import { OurGoogleMap } from './OurGoogleMap';
import './App.css';
import { MapPoint } from '../entities/MapPoint';
import { AnyAction, Dispatch } from 'redux';
import { connect } from "react-redux";
import { StoreState } from '..';

export interface FetchAction {
  payload: MapPoint[],
  type: ActionTypes.FETCH
}

export enum ActionTypes{
  FETCH
}

function fetchPointsFromFile(file: string): Promise<MapPoint[]> {
  return fetch(file)
    .then(response => response.text())
    .then(text => {
       const points: MapPoint[] =[];
       const parser = new DOMParser();
       const doc = parser.parseFromString(text, "application/xml");
       const wptTags = doc.querySelectorAll('wpt');

       wptTags.forEach(tag => {
        points.push({
          key: tag.querySelector('name').textContent || '',
          location: {
            lat: parseFloat(tag.getAttribute('lat')),
            lng:parseFloat(tag.getAttribute('lon'))
          }
        });
       });

       //console.log(wptTags);
       return points
    });
}

export const fetchPoints = (fileName: string)=>{
  return async (dispatch: Dispatch<AnyAction>) =>{
    const points = await fetchPointsFromFile(fileName);
    dispatch<FetchAction>({
      payload: points,
      type: ActionTypes.FETCH
    });
  };
};

export interface AppProps{
  points: MapPoint[];
  fetchPoints: Function;
}

interface AppState{
  fetching: boolean;
}

class _App extends React.Component<AppProps, AppState>{
  constructor(props: AppProps){
    super(props);
    this.state = {fetching: false};
    this.props.fetchPoints('/testdata/Only-points.gpx');
  }
  
  render(): ReactNode {
    return (
      <div id='appDiv'>
      <h1>GPS Navigator hepler tool</h1>
      <OurGoogleMap locations={this.props.points} drawRoute={false} />
      <footer>version:{process.env.REACT_APP_VERSION}</footer>
      </div>
    );
  }
}


const mapStateProps = (state:StoreState):{ points: MapPoint[]} =>{
  return {points: state.points}
};

export const App = connect(
  mapStateProps,
  { fetchPoints }
)(_App);
