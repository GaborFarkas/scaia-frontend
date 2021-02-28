import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoJSON } from 'ol/format';
import { GlobalConstants } from 'src/global';
import { HttpClient } from '@angular/common/http';
import { ProductMap } from '../models/productmap.model';

@Injectable({ providedIn: 'root' })
export default class MapService {
    private baseUrl: string = GlobalConstants.baseUrl;

    constructor(private http: HttpClient) { }

    getVectorLayer(layerId?: string, jobId?: string): Observable<GeoJSON> {
        let mapUrl: string = this.baseUrl + '/get_geojson';
        if (layerId) {
            mapUrl += '?lyrid=' + layerId;
        }
        if (jobId) {
            mapUrl += (mapUrl.indexOf('?') !== -1 ? '&' : '?') + 'jobid=' + jobId;
        }

        return this.http.get<GeoJSON>(mapUrl);
    }

    getMap(id: string): Observable<ProductMap> {
        let mapUrl: string = this.baseUrl + '/get_map?id=' + id;

        return this.http.get<ProductMap>(mapUrl);
    }

}
