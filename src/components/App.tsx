import React, { ReactNode } from 'react';
import { OurGoogleMap } from './OurGoogleMap';
import './App.css';
import { MyMapProps } from '../props/MyMapProps';
import { MapPoint } from '../entities/MapPoint';
import { CoordinatesHelper } from '../coordinates/CoordinatesHelper';
import { AnyAction, Dispatch } from 'redux';
import { connect } from "react-redux";
import { StoreState } from '..';

export interface FetchAction {
  payload: MapPoint[],
  type: string
}



/*export const fetchPoints = ()=>{
  return async (dispatch: Dispatch) =>{
    const response =  await fetch('testdata/Only-points.gpx')
    .then(r=> r.text())
    .then(text => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "application/xml");
      const wptTags = doc.querySelectorAll('wpt');

      let points: MapPoint[]= [];
      wptTags.forEach(tag => {
        points.push(
          {
            key: tag.querySelector('name').textContent || '',
            location: {
              lat: parseFloat(tag.getAttribute('lat')),
              lng:parseFloat(tag.getAttribute('lon'))
            }
          });
      return points;
      });
    dispatch<FetchTodosAction>({
      type: 'Fetch',
      payload: response
    });
  });
*/

function fetchPoints(file: string): Promise<MapPoint[]> {
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

export const fetchPoints1 = (fileName: string)=>{
  return async (dispatch: Dispatch<AnyAction>) =>{
    const points = await fetchPoints(fileName);
    dispatch<FetchAction>({
      payload: points,
      type: 'fetch'
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
    this.props.fetchPoints();
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
