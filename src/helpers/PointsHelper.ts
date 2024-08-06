import { MapPoint, Segment } from "../entities/MapPoint";

export class PointsHelper{

  /**Parses <wpt> tag and returns array of points from .gpx file that contains only points */
  public static getOnlyPoints(tags: NodeListOf<Element>): MapPoint[]{
    const points: MapPoint[] =[];
    tags.forEach(tag => {
      points.push({
        key: tag.querySelector('name').textContent || '',
        location: {
          lat: parseFloat(tag.getAttribute('lat')),
          lng:parseFloat(tag.getAttribute('lon'))
        },
        addMarker: true
      });
     });
    return points;
  }
  
  /**Parses <trkseg> tags and returns the union of array of points from .gpx file that contains routes
   * and an array with Segments of routes
  */
  public static getPointsWithRoute(tags: NodeListOf<Element>): {mapPoints: MapPoint[], routeSegments: Segment[]} {
    const points: MapPoint[] =[];
    const segments: Segment[]=[];
    let totalPointsCounts = 0;

    //iterate trkseg tags
    for (let index = 0; index < tags.length; index++) {
      //counter for points in segment
      let segmentPointsCounter = 0;
      
      //itearate inner trkpt tags
      const innerTags = tags[index].querySelectorAll('trkpt');
      innerTags.forEach(tag =>{
        points.push({
          key: `p${totalPointsCounts}`,
          location: {
            lat: parseFloat(tag.getAttribute('lat')),
            lng:parseFloat(tag.getAttribute('lon'))
          }
        });
        totalPointsCounts++;
        segmentPointsCounter++;
      });
      
      //make first and last point for segment showable
      points[totalPointsCounts-segmentPointsCounter].addMarker = true;
      points[totalPointsCounts-1].addMarker = true;

      //store point's indexes to segments
      segments.push({
        start: totalPointsCounts - segmentPointsCounter,
        end: totalPointsCounts -1
      });
    }

    return {mapPoints: points, routeSegments: segments};
  }

  public static GetDefaultPointName():string{
    return `p${Date.now()}`;
  }
}