import { Component } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor() {
    this.initMap();
  }

  public initMap(){
    return true;
  }
}
