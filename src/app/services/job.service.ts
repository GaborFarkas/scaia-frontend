import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/global';
import { HttpClient } from '@angular/common/http';
import { Job, NewJobResponse } from '../models/job.model';
import { modelToFormData } from '../utils/form.util';

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

    newJobGet(): Observable<NewJobResponse> {
        let jobUrl: string = this.baseUrl + '/new_job';

        return this.http.get<NewJobResponse>(jobUrl);
    }

    newJobPost(requestData: Record<string, any>): Observable<NewJobResponse> {
        let jobUrl: string = this.baseUrl + '/new_job';

        return this.http.post<NewJobResponse>(jobUrl, modelToFormData(this.processNewJobRequest(requestData)));
    }

    /**
     * Processes raw form input by converting Date objects to local date strings.
     * @param rawData
     */
    private processNewJobRequest(rawData: Record<string, any>): Record<string, any> {
        const processedData = {};

        for (let i in rawData) {
            if (rawData[i] instanceof Date) {
                processedData[i] = (rawData[i] as Date).toLocaleDateString();
            } else {
                processedData[i] = rawData[i];
            }
        }

        return processedData;
    }
}
