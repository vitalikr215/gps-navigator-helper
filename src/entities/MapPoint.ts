export interface MapPoint{
  key?: string;
  location: google.maps.LatLngLiteral;
}

export interface Segment{
  start: number,
  end: number
}