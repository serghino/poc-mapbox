import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {MapService} from '../../../services/map.service';
import {GeoJson, FeatureCollection} from '../map';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css']
})
export class MapBoxComponent implements OnInit {

  // default settings
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 45.50500547746486;
  lng = -73.60717582048977;
  message = '';

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
      zoom: 13, // starting zoom
      center: [this.lng, this.lat], // starting position [lng, lat]
      });

      // add map controls
      this.map.addControl(new mapboxgl.NavigationControl());

      // check listener on map control.
      this.map.on('click',(event)=>{
        const coordinates = [event.lngLat.lng, event.lngLat.lat];
        // add default tag
        (!this.message) ? this.message = 'Not marker added' : this.message;
        const newMarker = new GeoJson(coordinates, {message: this.message});
        this.mapService.createMarker(newMarker);
        // clean message
        this.message = '';
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
          this.mapService.subject$.subscribe((markers=>{
            const data = new FeatureCollection(markers);
            this.source.setData(data);
            this.markers = this.mapService.getMarkers();
          }))

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
