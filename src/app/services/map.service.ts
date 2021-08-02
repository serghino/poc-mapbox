import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { GeoJson } from '../components/map/map';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})

// initialize the application map.
export class MapService {

  private dblocal: Array<GeoJson> = [];
  public subject$ = new Subject<GeoJson[]>()

  constructor() { 
    // workaround to set token.
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  // here are all methods that there are going to be called after to save data.
   createMarker(marker: GeoJson){
    // unique id
    if(this.dblocal.length > 0){
      marker.$key = this.dblocal[this.dblocal.length - 1].$key + 1;
    }
    this.dblocal.push(marker);
    this.subject$.next(this.dblocal);
  }

  getMarkers(): Array<GeoJson>{
    return this.dblocal;
  }

  removeMarker($key: number){
    this.dblocal = this.dblocal.filter((data)=> data.$key !== $key);
    this.subject$.next(this.dblocal);
  }
}
