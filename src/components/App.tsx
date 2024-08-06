import React, { FormEvent, ReactNode, useRef, useState } from 'react';
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

export interface NewRouteAction{
  payload: MyMapProps,
  type: ActionTypes.NEW_ROUTE
}

export enum ActionTypes{
  FETCH,
  NEW_ROUTE
}

function fetchPointsFromFile(file: string): Promise<MyMapProps> {
  return fetch(file)
    .then(response => response.text())
    .then(text => {
       let points: MapPoint[] =[];
       let pointsInfo: MyMapProps = {locations:[], drawRoute: false, routeSegments:[], newRoute: false};

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

export const setNewRouteMode = (modeOn: boolean)=>{
  return async (dispatch: Dispatch<AnyAction>) =>{
    dispatch<NewRouteAction>({
      payload: { locations:[], routeSegments: [], drawRoute: false, newRoute: modeOn},
      type: ActionTypes.NEW_ROUTE
    });
  };
}

export interface AppProps{
  pointsInfo: MyMapProps;
  fetchPoints: Function;
  setNewRouteMode: Function;
}

interface AppState{
  fetching: boolean;
  isNewRoute: boolean;
}

class _App extends React.Component<AppProps, AppState>{
  fileInput: any;
  checkboxRef;// = useRef(null)
  
  constructor(props: AppProps){
    super(props);
    this.state = {fetching: false, isNewRoute: false};
    this.fileInput = React.createRef();
    this.checkboxRef = React.createRef();
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
    //if checked new route checkbox clear points and routes
    this.props.setNewRouteMode(this.checkboxRef.current.checked);
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
      <div style={{marginTop: 10}}>
        <input type="checkbox" id="chkCreateRoute" name="createRoute" ref={this.checkboxRef} defaultChecked={false} onChange={this.onCreateRouteModeChange}/>
        <label htmlFor="chkCreateRoute"> Create new route</label><br></br>
      </div>
      <OurGoogleMap locations={this.props.pointsInfo.locations} 
        drawRoute={this.props.pointsInfo.drawRoute} 
        routeSegments={this.props.pointsInfo.routeSegments}
        newRoute={this.props.pointsInfo.newRoute}/>
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
  { fetchPoints, setNewRouteMode }
)(_App);


