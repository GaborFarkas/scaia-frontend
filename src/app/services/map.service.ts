import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoJSON } from 'ol/format';
import { GlobalConstants } from 'src/global';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export default class MapService {
    private baseUrl: string = GlobalConstants.baseUrl;

    constructor(private http: HttpClient) { }
    
    getMap(): Observable<GeoJSON> {
        const mapUrl: string = this.baseUrl + '/get_map';
        return this.http.get<GeoJSON>(mapUrl);
    }
    
}