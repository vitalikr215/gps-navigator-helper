import React, { useCallback, useEffect, useState } from "react";
import { APIProvider, AdvancedMarker, Map, MapMouseEvent } from "@vis.gl/react-google-maps";
import { MapPoint, Segment } from "../entities/MapPoint";
import { MyMapProps } from "../props/MyMapProps";
import { Polyline } from "./Polyline";
import { ColorHelper } from "../helpers/ColorHelper";
import { PointsHelper } from "../helpers/PointsHelper";

function getCenter(points: MapPoint[]): MapPoint{
  let position = Math.round(points.length/2)
  if (position ==1){
    return points[0];
  }
  else{
    return points[position];
  }
}

let idCounter =1;

export const OurGoogleMap: React.FC<MyMapProps> = ({locations, drawRoute, routeSegments, newRoute})=>{

  const [loc, setLocations] = useState<MapPoint[]>([]);

  useEffect(() => {
    if (locations.length > 0 && !newRoute) {
      setLocations(locations);
    }
    else if (newRoute){
      setLocations([]);
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

  //<button style={}><img src='/icons8-save-50.png'/></button>
  const PointsList = (props:{points: MapPoint[]})=>{    
    return(
      <div className="flex-child-element">
        <h4>
          Route points:
        </h4>
        {
          props.points.map( (p: MapPoint) => (
            <div>
            <div>
              <button value={p.id} onClick={removePointFromRoute}>[ X ]</button>
            </div>
            <div>
              <input className="point-name-input" readOnly type="text" value={p.key}></input>
              <p className="point-coord-text">{p.location.lat}, {p.location.lng}</p>
            </div>
            </div>
          ))
        }
      </div>
    )
  }

  const onDblclick = (ev: MapMouseEvent)=>{
    //add point on map only in case when we are in new route mode
    if (newRoute){
      setLocations((prevLocs) =>[
        ...prevLocs,
        { 
          location: ev.detail.latLng, 
          addMarker: true, 
          key: PointsHelper.GetDefaultPointName(), 
          id: idCounter++ 
        }
      ]);
    }
  };

  const removePointFromRoute = (event: any) => {
    let idToRemove = Number(event.target.value)
    let updatedPoints = loc.filter(item => item.id !== idToRemove);
    setLocations(updatedPoints);
    //console.log(loc.length);
  }
  
  
  return(<div className="flex-parent-div">
  <div className="map-div">
    <APIProvider apiKey={apiKey}>
      <Map defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom} mapId='DEMO_MAP_ID' 
        disableDoubleClickZoom = {true} onDblclick={onDblclick}>
        <PointMarkers points={loc}/>
        <Polylines points={loc} segments={routeSegments}/>
      </Map>
    </APIProvider>
  </div >
    {newRoute && <PointsList points={loc}/>} 
  </div>
  )
}
