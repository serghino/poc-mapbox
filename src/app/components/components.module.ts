import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MapBoxComponent } from './map/map-box/map-box.component';



@NgModule({
  declarations: [
    MapBoxComponent
  ],
  exports: [MapBoxComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  providers: []
})
export class ComponentsModule { }
