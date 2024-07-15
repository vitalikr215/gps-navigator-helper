import React from 'react';
import { OurGoogleMap } from './OurGoogleMap';
import './App.css';
import { MyMapProps } from '../props/MyMapProps';
import { MapPoint } from '../entities/MapPoint';

const App=()=> {  

  const mapProps:MapPoint[] =  [{key:'Point1', location:{
    lat:48.47105362, lng: 34.78784513
  }},
  {key:'Point2', location:{
    lat: 48.48183032, lng: 34.74699403
  }},
  {key:'Point3', location:{
    lat:48.49391789, lng:34.72550502
  }}];

  const empty: MapPoint[] = [];

  return (
    <div id='appDiv'>
      <h1>GPS Navigator hepler tool</h1>
      <OurGoogleMap locations={mapProps}/>  
      <footer>version:{process.env.REACT_APP_VERSION}</footer>
    </div>
    
  );
}

export default App;
