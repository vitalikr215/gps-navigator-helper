import moment from "moment";
import { MapPoint, Segment } from "../entities/MapPoint";

/**
 * Supported result filename formats
 */
export enum GPXFilesNaming{
  /**
   * Filename format like [Маршр. точки_04-ИЮЛ-20.gpx]
   */
  eTrex10,
  /**
   * Filename format like [points-2024-8-23-14-31.gpx]
   */
  Default
};

export class PointsHelper{

  static DEFAULT_CENTER: MapPoint = { location: {lat:48.47555614, lng: 34.73800501}};
  
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

  /**
   * Gets unique default point name
   * @returns point name based on current timestamp
   */
  public static GetDefaultPointName():string{
    return `p${Date.now()}`;
  }

  /**
   * Generate filename for result .gpx file of selected naming standard.
   */
  public static GetResultFilename(naming:GPXFilesNaming = GPXFilesNaming.Default):string{
    let fileName: string = '';
    
    switch (naming) {
      case GPXFilesNaming.eTrex10:
        fileName = `Маршр. точки_${moment().format('DD')}-${PointsHelper.GetBriefMonthName(moment().month()+1)}-${moment().format('YY')}.gpx`;
        break;
    
      default:
        const now = Date.now();
        fileName = `points-${moment().format('YYYY-MM-DD-hh-mm')}.gpx`;
    }
 
    return fileName;
  }

  private static GetBriefMonthName(month: number):string{
    let monthName = '';
    
    switch (month) {
      case 1:
        monthName ='ЯНВ';  
        break;
      case 2:
        monthName ='ФЕВ';
        break;
      case 3:
        monthName ='МАР';
        break;
      case 4:
        monthName ='АПР'; 
        break;
      case 5:
        monthName ='МАЙ';
        break;
      case 6:
        monthName ='ИЮН';     
        break;
      case 7:
        monthName ='ИЮЛ';
        break;
      case 8:
        monthName ='АВГ';
        break;
      case 9:
        monthName ='СЕН';
        break;
      case 10:
        monthName ='ОКТ';
        break;
      case 11:
        monthName ='НОЯ';
        break;
      case 12:
        monthName ='ДЕК';        
        break;
      default:
        break;
    }
    return monthName;
  }
}