import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertType } from 'src/app/models/alert.model';
import { ProductMapDownload } from 'src/app/models/productdownload.model';
import AlertService from 'src/app/services/alert.service';
import DownloadService from 'src/app/services/download.service';

@Component({
    selector: 'app-dataDownload',
    templateUrl: './dataDownload.component.html',
    styleUrls: ['./dataDownload.component.css']
})
export class DataDownloadComponent implements AfterViewInit {
    public map: ProductMapDownload;

    @Input() mapId: string;

    @Output() close = new EventEmitter();
    @Output() back = new EventEmitter();

    constructor(
        private downloadService: DownloadService,
        private alertService: AlertService,
        private router: Router) { }

    public ngAfterViewInit(): void {
        if (this.mapId) {
            this.getMapDownload(this.mapId);
        }
    }

    /**
     * Sends a request to go back to the product list page.
     */
    public goBack(): void {
        this.back.emit();
    }

    /**
     * Gets the download information for the specified job ID.
     */
    private getMapDownload(id: string): void {
        this.downloadService.getDownloads(id).subscribe(data => {
            this.map = data;
        },
        err => {
            // If we get an Unauthorized response, the user is not allowed to use the app. Go back to the login page.
            if (err.status === 401) {
                this.router.navigate(["login"]);
            } else if (err.status === 403) {
                this.alertService.alert(AlertType.ERROR, 'You are not eligible to download the specified map.');
            } else if (err.status === 404) {
                this.alertService.alert(AlertType.ERROR, 'Could not find the specified map.');
            } else {
                this.alertService.alert(AlertType.ERROR, 'An unexpected error happened, please try again later.');
            }
            this.close.emit();
        });
    }
}
