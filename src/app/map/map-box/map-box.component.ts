import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Marker } from 'mapbox-gl';
import {MapService} from '../../services/map.service';
import {GeoJson, FeatureCollection} from '../map';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css']
})
export class MapBoxComponent implements OnInit {

  // default settings
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  lat = 37.75;
  lng = -122.41;
  message = 'Welcome to the new tech on maps';

  // data
  source: any;
  markers: any;


  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.markers = this.mapService.getMarkers();
    this.initializeMap();
  }

  public initializeMap(){
    // locate the user
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position)=>{
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center:[this.lng, this.lat]
        })
      })
    }
    this.buildMap();
  }

  public buildMap(){
     this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: this.style,
      center: [this.lng, this.lat], // starting position [lng, lat]
      zoom: 13 // starting zoom
      });

      // add map controls
      this.map.addControl(new mapboxgl.NavigationControl());

      // check listener on map control.
      this.map.on('click',(event)=>{
        const coordinates = [event.lngLat.lng, event.lngLat.lat];
        const newMarker = new GeoJson(coordinates, {message: this.message});
        this.mapService.setMarker(newMarker);
      })

      // load map
      this.map.on('load',(event)=>{
        // add source.
        this.map.addSource('firebase',{
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
          });

          // get source
          this.source = this.map.getSource('firebase');

          // set source map
          console.log(`load database or service....`, this.source);

          // create map layer
          this.map.addLayer({
            id: 'firebase',
            source: 'firebase',
            type: 'symbol',
            layout:{
              'text-field': '{message}',
              'text-size': 24,
              'text-transform': 'uppercase',
              'icon-image': 'rocket-15',
              'text-offset': [0, 1.5]

            },
            paint:{
              'text-color': '#f16624',
              'text-halo-color': '#fff',
              'text-halo-width': 2
            }

          })

         
      })
  }
  // helpers
  removeMarker(marker:GeoJson){
    this.mapService.removeMarker(marker.$key);
  }
  flyTo(data:GeoJson){
    this.map.flyTo({
      center: data.geometry.coordinates as any
    });
  }
}
