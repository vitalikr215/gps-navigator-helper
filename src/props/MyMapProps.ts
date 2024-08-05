import { MapPoint, Segment } from "../entities/MapPoint";

export interface MyMapProps{
  locations: MapPoint[];
  routeSegments: Segment[];
  drawRoute: boolean;
}