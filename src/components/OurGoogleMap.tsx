import React, { useCallback, useEffect, useState } from "react";
import { APIProvider, AdvancedMarker, Map, MapMouseEvent } from "@vis.gl/react-google-maps";
import { MapPoint, Segment } from "../entities/MapPoint";
import { MyMapProps } from "../props/MyMapProps";
import { Polyline } from "./Polyline";
import { ColorHelper } from "../helpers/ColorHelper";

function getCenter(points: MapPoint[]): MapPoint{
  let position = Math.round(points.length/2)
  if (position ==1){
    return points[0];
  }
  else{
    return points[position];
  }
}

export const OurGoogleMap: React.FC<MyMapProps> = ({locations, drawRoute, routeSegments})=>{

  const [loc, setLocations] = useState<MapPoint[]>([]);

  useEffect(() => {
    if (locations.length > 0) {
      setLocations(locations);
    }
  }, [locations]);

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
        {
          props.points
          .filter(p => p.addMarker)
          .map( (p: MapPoint) => (
          <AdvancedMarker
            key={p.key}
            position={p.location}>
          </AdvancedMarker>
        ))}
      </>
    );
  };

  const Polylines = (props: {points: MapPoint[], segments: Segment[]}) =>{    
    return(
      <>
        {
          props.segments.map( (segment:Segment) =>(
            <Polyline
            key={`polilyne${segment.start}`}
            strokeWeight={10}
            strokeColor={ColorHelper.getRandomColor()}
            rawPath={drawRoute ? props.points.slice(segment.start,segment.end) : null}
            />
          ))
        }
      </>
    )
  };

  const onDblclick = (ev: MapMouseEvent)=>{
    setLocations([
      ...loc,
      { location: ev.detail.latLng, addMarker: true }
    ]);
  };

  
  
  return(<div className="map-div">
    <APIProvider apiKey={apiKey}>
      <Map defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom} mapId='DEMO_MAP_ID' 
        disableDoubleClickZoom = {true} onDblclick={onDblclick}>
        <PointMarkers points={loc}/>
        <Polylines points={loc} segments={routeSegments}/>
      </Map>
    </APIProvider>
  </div>
  )
}
