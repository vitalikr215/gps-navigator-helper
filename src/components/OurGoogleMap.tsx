import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { APIProvider, AdvancedMarker, Map, MapMouseEvent } from "@vis.gl/react-google-maps";
import { MapPoint, Segment } from "../entities/MapPoint";
import { MyMapProps } from "../props/MyMapProps";
import { Polyline } from "./Polyline";
import { ColorHelper } from "../helpers/ColorHelper";
import { GPXFilesNaming, PointsHelper } from "../helpers/PointsHelper";
import { savePointsToGPX } from "../actions/actions";


let idCounter =1;

export const OurGoogleMap: React.FC<MyMapProps> = ({locations, drawRoute, routeSegments, newRoute, center})=>{

  const [loc, setLocations] = useState<MapPoint[]>([]);

  useEffect(() => {
    if (locations.length > 0 && !newRoute) {
      setLocations(locations);
    }
    else if (newRoute){
      setLocations([]);
    }
  }, [locations]);

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

    const changePointNameAndUpdateState = (id: number) =>  (event: React.FocusEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setLocations(prevPoints =>
        prevPoints.map(point =>
          point.id === id ? { ...point, key: newValue } : point
        )
      );
    }
    //local state for storing temp values for textbox
    const [editingValue, setEditingValue] = useState<{ [id: number]: string }>({});

    const handleChange = (id: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setEditingValue(prev => ({ ...prev, [id]: newValue }));
    };

    return(
      <div className="flex-child-element">
        <div className="points-div">
          <p>
            Route points:
          </p>
          <button disabled={props.points.length==0} onClick={savePoints}><img src='/icons8-save-50.png'/></button>
        </div>
        {
          props.points.map( (p: MapPoint) => (
            <div>
            <div>
              <button value={p.id} onClick={removePointFromRoute}>[ X ]</button>
            </div>
            <div>
              <input className="point-name-input" onChange={handleChange(p.id)} onBlur={changePointNameAndUpdateState(p.id)}  type="text" 
                value={ editingValue[p.id] || p.key || '' }>
              </input>
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
  }

  const savePoints = (event: any)=>{
    const newGpxFile =  savePointsToGPX(loc);
    newGpxFile.then((gpxContent)=>{
      const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
      const url = URL.createObjectURL(blob);
    
      const link = document.createElement('a');
      link.href = url;
      link.download = PointsHelper.GetResultFilename(GPXFilesNaming.eTrex10);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
  
  return(<div className="flex-parent-div">
  <div className="map-div">
    <APIProvider apiKey={apiKey}>
      <Map 
        defaultCenter={center.location}
        //center={center.location} comment out because if it exists I can't move the map
        defaultZoom={11} mapId='DEMO_MAP_ID' 
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
