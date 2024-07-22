import React, { useEffect } from "react";
import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { MapPoint } from "../entities/MapPoint";
import { MyMapProps } from "../props/MyMapProps";
import { Polyline } from "./Polyline";

function getCenter(points: MapPoint[]): MapPoint{
  let position = Math.round(points.length/2)
  if (position ==1){
    return points[0];
  }
  else{
    return points[position];
  }
}

export const OurGoogleMap: React.FC<MyMapProps> = ({locations, drawRoute})=>{

  let defaultProps ={
    center: {
      lat: 48.47555614,
      lng: 34.73800501
    },
    zoom: 11
  };
  
  //calculate center coordinates based on existing points
  if (locations.length>0){
    const center = getCenter(locations);
    defaultProps.center.lat = center.location.lat;
    defaultProps.center.lng = center.location.lng;
  }

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const PointMarkers = (props: {points: MapPoint[]}) => {
    return (
      <>
        {props.points.map( (p: MapPoint) => (
          <AdvancedMarker
            key={p.key}
            position={p.location}>
          </AdvancedMarker>
        ))}
      </>
    );
  };
  
  return(<div className="map-div">
    <APIProvider apiKey={apiKey}>
      <Map defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom} mapId='DEMO_MAP_ID'>
        <PointMarkers points={locations}/>
        <Polyline
          strokeWeight={10}
          strokeColor={'#ff22cc88'}
          rawPath={drawRoute ? locations : null}
          //encodedPath={POLYGONS[11]}
        />
      </Map>
    </APIProvider>
  </div>
  )
}
