import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/global';
import { HttpClient } from '@angular/common/http';
import { Job } from '../models/job.model';

@Injectable({ providedIn: 'root' })
export default class JobService {
    private baseUrl: string = GlobalConstants.baseUrl;

    constructor(private http: HttpClient) { }

    getPublicJobs(): Observable<Job[]> {
        let jobUrl: string = this.baseUrl + '/get_jobs';

        return this.http.get<Job[]>(jobUrl);
    }

    getUserJobs(): Observable<Job[]> {
        let jobUrl: string = this.baseUrl + '/get_jobs?user';

        return this.http.get<Job[]>(jobUrl);
    }

    cancelJob(id: number): Observable<null> {
        let jobUrl: string = this.baseUrl + '/cancel_job?id=' + id;

        return this.http.get<null>(jobUrl);
    }

    removeJob(id: number): Observable<null> {
        let jobUrl: string = this.baseUrl + '/remove_job?id=' + id;

        return this.http.get<null>(jobUrl);
    }

}
