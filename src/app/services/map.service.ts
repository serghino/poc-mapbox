import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { GeoJson } from '../map/map';

@Injectable({
  providedIn: 'root'
})
// initialize the application map.
export class MapService {

  private dblocal!: Array<GeoJson>;

  constructor() { 
    // workaround to set token.
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;

  }

  // here are all methods that there are going to be called after to save data.
   setMarker(marker: GeoJson){
     marker.$key += 1;
    this.dblocal.push(marker);
  }

  getMarkers(): Array<GeoJson>{
    return this.dblocal;
  }

  removeMarker($key: number){
    this.dblocal = this.dblocal.filter((data)=> data.$key !== $key);
  }
}
