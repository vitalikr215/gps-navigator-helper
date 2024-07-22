import React, { FormEvent, ReactNode } from 'react';
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
  fileInput: any;

  constructor(props: AppProps){
    super(props);
    this.state = {fetching: false};
    this.fileInput = React.createRef();
  }

  onGetPoints = (event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    //for security reason we assuming that you could select files with points
    //only from /public/testdata/ folder
    try {
      let filename:string = this.fileInput.current.files[0].name;
      this.props.fetchPoints(`/testdata/${filename}`);  
    } catch (error) {
      alert('You have to choose .gpx file with points first'); 
    }
  };
  
  render(): ReactNode {
    return (
      <div id='appDiv'>
      <h1>GPS Navigator hepler tool</h1>
      <form onSubmit={this.onGetPoints}>
        <label>Select .gpx file with points: </label>
        <input type="file" id="pointsFile" name="pointsFile" ref={this.fileInput} accept=".gpx" />
        <button>Get points</button>
      </form>
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
