export interface IGeometry{
    type: string;
    coordinates: number[];
}

export interface IGeoJson{
    type: string;
    geometry: IGeometry;

    properties?: any;
    $key?:number;
}

export class GeoJson implements IGeoJson {
    $key = 1;
    type = 'Feature';
    geometry: IGeometry;

    constructor(type: string, coordinates:number[], public properties?:any){
        this.geometry = {
            type: 'Point',
            coordinates
        }
        this.properties = properties;
    }
}

export class FeatureCollection{
    type = 'FeatureCollection';
    constructor(public features:Array<GeoJson>){}
}
