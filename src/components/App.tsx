import React from 'react';
import { OurGoogleMap } from './OurGoogleMap';
import './App.css';

const App=()=> {  
  return (
    <div id='appDiv'>
      <h1>GPS Navigator hepler tool</h1>
      <OurGoogleMap/>  
      <footer>version:{process.env.REACT_APP_VERSION}</footer>
    </div>
    
  );
}

export default App;
