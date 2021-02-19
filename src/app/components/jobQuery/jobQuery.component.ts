import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from 'src/app/models/job.model';
import AlertService from 'src/app/services/alert.service';
import JobService from 'src/app/services/job.service';

@Component({
    selector: 'app-jobQuery',
    templateUrl: './jobQuery.component.html',
    styleUrls: ['./jobQuery.component.css']
})
export class JobQueryComponent implements OnInit {
    public jobs: Record<string, Job[]> = {};

    @Output() showMap = new EventEmitter<string>();

    constructor(
        private jobService: JobService,
        private alertService: AlertService,
        private router: Router) { }

    ngOnInit(): void {
        this.jobService.getPublicJobs().subscribe(data => {
            if (data.length) {
                this.jobs['Public products'] = data;
            }
        },
        err => {
            // If we get an Unauthorized response, the user is not allowed to use the app. Go back to the login page.
            if (err.status === 401) {
                this.router.navigate(["login"]);
            }
        });

        this.jobService.getUserJobs().subscribe(data => {
            if (data.length) {
                this.jobs['User products'] = data;
            }
        },
        err => {
            // If we get an Unauthorized response, the user is not allowed to use the app. Go back to the login page.
            if (err.status === 401) {
                this.router.navigate(["login"]);
            }
        });
    }

    /**
     * Expands and collapses products lists with the "collapsed" CSS class.
     * @param evt
     */
    public toggleExpand(evt: Event): void {
        // Target will the the header element (h5) of every list.
        const target: HTMLElement = evt.target as HTMLElement;

        if (target.parentElement) {
            if (target.parentElement.classList.contains('collapsed')) {
                target.parentElement.classList.remove('collapsed');
            } else {
                target.parentElement.classList.add('collapsed');
            }
        }
    }
}
