import React, { FormEvent, ReactNode, useRef, useState } from 'react';
import { OurGoogleMap } from './OurGoogleMap';
import './App.css';
import { connect } from "react-redux";
import { StoreState } from '..';
import { MyMapProps } from '../props/MyMapProps';
import { AppProps, AppState } from '../props/AppProps';
import { fetchPoints, setNewRouteMode } from '../actions/actions';

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


