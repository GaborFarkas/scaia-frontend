import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoJSON } from 'ol/format';
import { GlobalConstants } from 'src/global';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export default class MapService {
    private baseUrl: string = GlobalConstants.baseUrl;

    constructor(private http: HttpClient) { }

    getVectorLayer(id?: string): Observable<GeoJSON> {
        let mapUrl: string = this.baseUrl + '/get_geojson';
        if (id) {
            mapUrl += '?id=' + id;
        }

        return this.http.get<GeoJSON>(mapUrl);
    }

}
