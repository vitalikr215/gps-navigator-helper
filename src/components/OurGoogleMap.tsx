import React from "react";
import GoogleMapReact from 'google-map-react';

export const OurGoogleMap: React.FC = ()=>{
  const defaultProps ={
    center: {
      lat: 48.47555614,
      lng: 34.73800501
    },
    zoom: 11
  };

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  return(<div className="map-div">
    	<GoogleMapReact
        bootstrapURLKeys={{key:apiKey as string}}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
      </GoogleMapReact>
    
  </div>
  )
}