import { PointsHelper } from "../helpers/PointsHelper";
import { MyMapProps } from "../props/MyMapProps";
import { ActionTypes, FetchAction, NewRouteAction } from "./actions";

export const pointsReducer = (state: MyMapProps, action: FetchAction | NewRouteAction) :MyMapProps=>{
  switch (action.type) {
    case ActionTypes.FETCH:
      return action.payload;
    case ActionTypes.NEW_ROUTE:
      return action.payload;
    default:
      const defaultInfo: MyMapProps = {
        locations: [], 
        drawRoute: false, 
        routeSegments:[], 
        newRoute: false,
        center: PointsHelper.DEFAULT_CENTER
      };
      return defaultInfo;
  }
}