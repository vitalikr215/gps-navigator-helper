export interface MapPoint{
  id?: number;
  key?: string;
  location: google.maps.LatLngLiteral;
  addMarker? : boolean;
}

export interface Segment{
  start: number,
  end: number
}