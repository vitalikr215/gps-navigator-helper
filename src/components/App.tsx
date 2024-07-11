import React from 'react';
import { Map } from './Map';
import './App.css';

const App=()=> {
  return (
    <div id='appDiv'>
      <h1>GPS Navigator hepler tool</h1>
      <Map/>  
      <footer>version: {process.env.REACT_APP_VERSION}</footer>
    </div>
    
  );
}

export default App;
