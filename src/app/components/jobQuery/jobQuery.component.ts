import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertType } from 'src/app/models/alert.model';
import { Job, JobState } from 'src/app/models/job.model';
import AlertService from 'src/app/services/alert.service';
import JobService from 'src/app/services/job.service';

@Component({
    selector: 'app-jobQuery',
    templateUrl: './jobQuery.component.html',
    styleUrls: ['./jobQuery.component.css']
})
export class JobQueryComponent implements OnInit {
    public jobs: Record<string, Job[]> = {};
    public jobState = JobState;

    @Output() showMap = new EventEmitter<string>();

    constructor(
        private jobService: JobService,
        private alertService: AlertService,
        private router: Router) { }

    ngOnInit(): void {
        //TODO: Refactor when we need to serve multiple permission levels.
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

        this.refreshUserJobs();
    }

    /**
     * Fetches a new list of user jobs. Useful for monitoring / manual refresh.
     */
    private refreshUserJobs() {
        this.jobService.getUserJobs().subscribe(data => {
            if (data.length) {
                this.jobs['User products'] = data;
            } else if (this.jobs['User products']) {
                delete this.jobs['User products'];
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

    /**
     * Event listener for cancelling jobs.
     * @param job
     */
    public cancelJob(job: Job) {
        if (job.own) {
            this.jobService.cancelJob(job.id).subscribe(
                data => {
                    this.refreshUserJobs();
                },
                err => {
                    // If we get an Unauthorized response, the user is not allowed to use the app. Go back to the login page.
                    if (err.status === 401) {
                        this.router.navigate(["login"]);
                    } else if (err.status === 403) {
                        // If someone hacks through the client side permission checks, still provide a user-friendly response.
                        this.alertService.alert(AlertType.ERROR, 'Insufficient permissions to cancel this job.');
                    }
                });
        }
    }

    /**
     * Event listener for removing jobs.
     * @param job
     */
    public removeJob(job: Job) {
        if (job.own) {
            this.jobService.removeJob(job.id).subscribe(
                data => {
                    this.refreshUserJobs();
                },
                err => {
                    // If we get an Unauthorized response, the user is not allowed to use the app. Go back to the login page.
                    if (err.status === 401) {
                        this.router.navigate(["login"]);
                    } else if (err.status === 403) {
                        // If someone hacks through the client side permission checks, still provide a user-friendly response.
                        this.alertService.alert(AlertType.ERROR, 'Insufficient permissions to remove this job.');
                    }
                });
        }
    }

    /**
     * Event listener for displaying process results on the map.
     * @param job
     */
    public displayMap(job: Job) {
        if (job.status === JobState.SUCCESS || job.status === JobState.PARTIAL) {
            this.showMap.emit(job.id.toString());
        }
    }
}
