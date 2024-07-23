import { MapPoint } from "../entities/MapPoint";

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
        }
      });
     });
    return points;
  }
  
  /**Parses <trkpt> tag and returns array of points from .gpx file that contains routes */
  public static getPointsWithRoute(tags: NodeListOf<Element>): MapPoint[] {
    const points: MapPoint[] =[];
    let i = 0;
    const coeff = calculateCoeficient(tags.length);
  
    tags.forEach(tag => {
      if (i == 0 || (i % coeff == 0)){
        points.push({
          key: `p${i}`,
          location: {
            lat: parseFloat(tag.getAttribute('lat')),
            lng:parseFloat(tag.getAttribute('lon'))
          }
        });
      }
      i++;
     });
    console.log (`tprk tags: ${points.length}`);
    return points;
  }
}

/**Calculates the number of skipping points based of the total number of the points */
function calculateCoeficient(pointsCount:number) : number{
  switch (true) {
    case (pointsCount <= 1000):
        return pointsCount/10;
    case (pointsCount >= 1001 || pointsCount<=9999):
      return Math.round(pointsCount/200);
    case (pointsCount >= 10000):
        return Math.round(pointsCount/250);
  }
}