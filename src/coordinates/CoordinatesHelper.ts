import { MapPoint } from "../entities/MapPoint";
import xml2sj from "xml2js";
import * as fs from 'fs';
 

export class CoordinatesHelper{
  constructor(public sourceFile: string){

  }

  async getPoints():Promise<void>{
    return await fetch(this.sourceFile)
      .then(r=> r.text())
      .then(text => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "application/xml");
        const wptTags = doc.querySelectorAll('wpt');

        let points: MapPoint[]= [];
        wptTags.forEach(tag => {
          points.push(
            {
              key: tag.querySelector('name').textContent || '',
              location: {
                lat: parseFloat(tag.getAttribute('lat')),
                lng:parseFloat(tag.getAttribute('lon'))
              }
            })
        });
    });
  }
}