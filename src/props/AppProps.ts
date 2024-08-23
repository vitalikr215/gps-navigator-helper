import { MyMapProps } from "./MyMapProps";

export interface AppProps{
  pointsInfo: MyMapProps;
  fetchPoints: Function;
  setNewRouteMode: Function;
}

export interface AppState{
  fetching: boolean;
  isNewRoute: boolean;
}
