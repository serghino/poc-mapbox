import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddMarkerComponent } from './add-marker/add-marker.component';

// Lazy load.
const childRoutes: Routes = [
  { path: 'addMaker', component: AddMarkerComponent, data: { titulo: 'Add Maker' } },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(childRoutes) 
  ],
  exports: [ RouterModule ]
})
export class ChildRoutesModule { }
