import { MapPoint } from "../entities/MapPoint";
import moment from "moment";

export class CoordinatesSaver{
  /**Add wpt tags to boilerplate document */
  static PrepareResultGPX(gpxDocument: Document, points: MapPoint[]): string {
    const metadataTag = gpxDocument.querySelector("metadata");
    metadataTag.setAttribute('time',moment().format('YYYY-MM-DD[T]hh:mm:ss'));

    let timeOffset:number = 0;//to create different time for different points

    //appending wpt tag which looks like this
    /*<wpt lat="48.444035" lon="35.192855" xmlns="">
      <time>2020-03-13T10:32:39</time>
      <name>1Cementry</name>
      <cmt />
      <sym>Flag, Blue</sym>
     </wpt>*/
    points.forEach(p=>{
      const wptTag = gpxDocument.createElement("wpt");
      wptTag.setAttribute("lat", p.location.lat.toString());
      wptTag.setAttribute("lon", p.location.lng.toString());

      const timeTag = gpxDocument.createElement('time');
      timeTag.textContent = moment().add(timeOffset, 'm').format('YYYY-MM-DD[T]hh:mm:ss');

      const nameTag = gpxDocument.createElement("name");
      nameTag.textContent = p.key || `p${Date.now()}`;
      
      const cmtTag = gpxDocument.createElement("cmt");
      
      const symTag = gpxDocument.createElement("sym");
      symTag.textContent = "Flag, Blue";
      
      //add children to wpt tag
      wptTag.appendChild(timeTag);
      wptTag.appendChild(nameTag);
      wptTag.appendChild(cmtTag);
      wptTag.appendChild(symTag);  

      //insert after metadata tag
      metadataTag.parentNode.insertBefore(wptTag, metadataTag.nextSibling);
      timeOffset++;
    });

    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(gpxDocument);

    return xmlString;
  }
}