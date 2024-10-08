import { AnyAction, Dispatch } from 'redux';
import { MyMapProps } from '../props/MyMapProps';
import { MapPoint } from '../entities/MapPoint';
import { PointsHelper } from '../helpers/PointsHelper';
import { CoordinatesSaver } from '../helpers/CoordinatesSaver';

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
      payload: { locations:[], routeSegments: [], drawRoute: false, newRoute: modeOn, center: PointsHelper.DEFAULT_CENTER},
      type: ActionTypes.NEW_ROUTE
    });
  };
}

function fetchPointsFromFile(file: string): Promise<MyMapProps> {
  return fetch(file)
    .then(response => response.text())
    .then(text => {
       let points: MapPoint[] =[];
       let pointsInfo: MyMapProps = {locations:[], drawRoute: false, routeSegments:[], newRoute: false, center: PointsHelper.DEFAULT_CENTER};

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
       
       //setting up the point at which the GoogleMap will be centered
       const centerPointPosition = Math.round(pointsInfo.locations.length/2) == 1 
                                   ? 0
                                   : Math.round(pointsInfo.locations.length/2) -1 
       pointsInfo.center = {location: {
                                        lat: pointsInfo.locations[centerPointPosition].location.lat,
                                        lng: pointsInfo.locations[centerPointPosition].location.lng}
       };

       return pointsInfo;
    });
}

export function savePointsToGPX(points: MapPoint[]):Promise<string>{
  return fetch('/testdata/boilerplate.gpx')
    .then(response => response.text())
    .then(text => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "application/xml");

      const newXmlString = CoordinatesSaver.PrepareResultGPX(doc, points);
      return newXmlString;
    });
}