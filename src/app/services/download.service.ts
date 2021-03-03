import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/global';
import { HttpClient } from '@angular/common/http';
import { ProductMapDownload } from '../models/productdownload.model';

@Injectable({ providedIn: 'root' })
export default class DownloadService {
    private baseUrl: string = GlobalConstants.baseUrl;

    constructor(private http: HttpClient) { }

    getDownloads(id: string): Observable<ProductMapDownload> {
        let downloadUrl: string = this.baseUrl + '/get_downloads?id=' + id;

        return this.http.get<ProductMapDownload>(downloadUrl);
    }

    getDownloadLink(mapId: string, layerId: string): string {
        return this.baseUrl + '/download_layer?id=' + mapId + '&layer=' + layerId;
    }
}
