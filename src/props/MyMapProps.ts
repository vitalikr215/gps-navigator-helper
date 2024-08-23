import { MapPoint, Segment } from "../entities/MapPoint";

export interface MyMapProps{
  locations: MapPoint[];
  routeSegments: Segment[];
  center: MapPoint;
  drawRoute: boolean;
  newRoute: boolean;
}