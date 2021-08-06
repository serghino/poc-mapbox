import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
// plugins mapxbox
import { RulerControl } from 'mapbox-gl-controls';
import { area } from "@turf/turf";
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';

import { MapService } from '../../../services/map.service';
import { GeoJson, FeatureCollection } from '../map';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.css'],
})
export class MapBoxComponent implements OnInit {
  // default settings map
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 45.50500547746486;
  lng = -73.60717582048977;
  message = '';

  controlRuler: any | null;

  // data
  source: any;
  markers: any;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.markers = this.mapService.getMarkers();
    this.initializeMap();
  }

  public initializeMap() {
    // locate the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat],
        });
      });
    }
    this.buildMap();
  }

  public buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: this.style,
      zoom: 13, // starting zoom
      center: [this.lng, this.lat], // starting position [lng, lat]
    });

    const draw = this.addDrawControl();

    // add map controls
    this.map.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        visualizePitch: false,
        showZoom: true,
      })
    );
    // add draw control.
    this.map.addControl(draw);
    this.map.on('draw.create', updateArea);
    this.map.on('draw.delete', updateArea);
    this.map.on('draw.update', updateArea);
    
    function updateArea(e: any) {
      console.log(e);
      const data = draw.getAll();
      const answer = document.getElementById('calculated-area');
      if (data.features.length > 0) {
        const resultArea = area(data);
        // Restrict the area to 2 decimal points.
        const rounded_area = Math.round(resultArea * 100) / 100;
        answer!.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
      } else {
        answer!.innerHTML = '';
        if (e.type !== 'draw.delete') alert('Click the map to draw a polygon.');
      }
    }
    // check listener on map control.
    /* this.map.on('click', (event) => {
      const coordinates = [event.lngLat.lng, event.lngLat.lat];
      // add default tag
      !this.message ? (this.message = 'Not marker added') : this.message;
      const newMarker = new GeoJson(coordinates, { message: this.message });
      this.mapService.createMarker(newMarker);
      // clean message
      this.message = '';
    }); */

    // load map
    this.map.on('load', (event) => {
      // add source.
      this.map.addSource('firebase', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // get source
      this.source = this.map.getSource('firebase');

      // set source map
      this.mapService.subject$.subscribe((markers) => {
        const data = new FeatureCollection(markers);
        this.source.setData(data);
        this.markers = this.mapService.getMarkers();
      });

      // create map layer
      this.map.addLayer({
        id: 'firebase',
        source: 'firebase',
        type: 'symbol',
        layout: {
          'text-field': '{message}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'rocket-15',
          'text-offset': [0, 1.5],
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2,
        },
      });
    });
  }

  // helpers
  removeMarker(marker: GeoJson) {
    this.mapService.removeMarker(marker.$key);
  }
  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates as any,
    });
  }

  // TODO: add this method in the map service.
  addDrawControl() {
    return new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        point: true,
        polygon: true,
        trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      // defaultMode: 'draw_polygon',
    });
  }

  addRulerOnMap() {
    return new RulerControl({
      units: 'meters',
      font: ['Montserrat-Semibold'],
      labelFormat: (n: number) => `${n.toFixed(0)} m`,
    });

    // add rule to map
    // this.map.addControl(this.controlRuler, 'top-right');
  }
}
