import React, { FormEvent, ReactNode, useState } from 'react';
import { OurGoogleMap } from './OurGoogleMap';
import './App.css';
import { MapPoint } from '../entities/MapPoint';
import { AnyAction, Dispatch } from 'redux';
import { connect } from "react-redux";
import { StoreState } from '..';
import { PointsHelper } from '../helpers/PointsHelper';
import { MyMapProps } from '../props/MyMapProps';
import { start } from 'repl';

export interface FetchAction {
  payload: MyMapProps,
  type: ActionTypes.FETCH
}

export enum ActionTypes{
  FETCH
}

function fetchPointsFromFile(file: string): Promise<MyMapProps> {
  return fetch(file)
    .then(response => response.text())
    .then(text => {
       let points: MapPoint[] =[];
       let pointsInfo: MyMapProps = {locations:[], drawRoute: false, routeSegments:[]};

       const parser = new DOMParser();
       const doc = parser.parseFromString(text, "application/xml");
       
       //here we checking what type of file do we have
       const wptTags = doc.querySelectorAll('wpt');
       //in this case we have file only with points
       if (wptTags.length >0){
        points = PointsHelper.getOnlyPoints(wptTags);
        pointsInfo.drawRoute = false;
        pointsInfo.locations = points;
       }

       const trksegTags = doc.querySelectorAll('trkseg');
       if (trksegTags.length >0){
        const pointsAndSegments = PointsHelper.getPointsWithRoute(trksegTags);
        pointsInfo.drawRoute = true;
        pointsInfo.locations = pointsAndSegments.mapPoints;
        pointsInfo.routeSegments = pointsAndSegments.routeSegments;
       }
       
       return pointsInfo;
    });
}

export const fetchPoints = (fileName: string)=>{
  return async (dispatch: Dispatch<AnyAction>) =>{
    const pointsInfo = await fetchPointsFromFile(fileName);
    dispatch<FetchAction>({
      payload: pointsInfo,
      type: ActionTypes.FETCH
    });
  };
};

export interface AppProps{
  pointsInfo: MyMapProps;
  fetchPoints: Function;
}

interface AppState{
  fetching: boolean;
  isNewRoute: boolean;
}

class _App extends React.Component<AppProps, AppState>{
  fileInput: any;
  
  constructor(props: AppProps){
    super(props);
    this.state = {fetching: false, isNewRoute: false};
    this.fileInput = React.createRef();
  }

  onGetPoints = (event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    //for security reason we assuming that you could select files with points
    //only from /public/testdata/ folder
    try {
      let filename:string = this.fileInput.current.files[0].name;
      this.props.fetchPoints(`/testdata/${filename}`);
      //this.props.fetchPoints(`/testdata/Points-with-routes.gpx`);
    } catch (error) {
      alert('You have to choose .gpx file with points first'); 
    }
  };
  
  onCreateRouteModeChange = (event: any)=>{
    this.setState({isNewRoute : !this.state.isNewRoute});
    //console.log(this.state.isNewRoute);
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
      <OurGoogleMap locations={this.props.pointsInfo.locations} 
        drawRoute={this.props.pointsInfo.drawRoute} 
        routeSegments={this.props.pointsInfo.routeSegments}/>
      <footer>version:{process.env.REACT_APP_VERSION}</footer>
      </div>
    );
  }
}


const mapStateProps = (state:StoreState):{ pointsInfo: MyMapProps} =>{
  return {pointsInfo: state.pointsInfo}
};

export const App = connect(
  mapStateProps,
  { fetchPoints }
)(_App);


