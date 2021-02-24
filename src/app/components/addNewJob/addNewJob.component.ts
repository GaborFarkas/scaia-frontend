import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertType } from 'src/app/models/alert.model';
import { NewJobError, NewJobResponse } from 'src/app/models/job.model';
import { EntryType, Product, ProductInputType } from 'src/app/models/product.model';
import { HomePage } from 'src/app/pages/home';
import AlertService from 'src/app/services/alert.service';
import ConfigService from 'src/app/services/config.service';
import JobService from 'src/app/services/job.service';

@Component({
    selector: 'app-addNewJob',
    templateUrl: './addNewJob.component.html',
    styleUrls: ['./addNewJob.component.css']
})

export class AddNewJobComponent implements OnInit {
    public activeNode: Product;
    public newJobForm: FormGroup;
    public submitted: boolean = false;
    public errorMsg: string = '';

    @Input() navigateId: string;

    @Output() close = new EventEmitter();
    @Output() showMap = new EventEmitter<string>();
    @Output() getHelp = new EventEmitter<string>();

    constructor(
        private configService: ConfigService,
        private jobService: JobService,
        private alertService: AlertService,
        private router: Router,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.getConfig();
    }

    /**
     * Listener called when the user clicks on a GUI category button.
     * @param item
     */
    public navigateTo(item: Product): void {
        this.activeNode = item;
        if (item.type === EntryType.MAP) {
            this.showMap.emit(item.id);
            this.close.emit();
        } else if (item.type === EntryType.PROCESS) {
            // Set up form
            this.createForm();
            this.jobService.newJobGet().subscribe(data => {
                // Patch the form with the token when we get it.
                this.newJobForm.patchValue({
                    csrf: data.token
                });
            },
            err => {
                // If we get an Unauthorized response, the user is not allowed to use the app. Go back to the login page.
                if (err.status === 401) {
                    this.router.navigate(["login"]);
                }
            });
        }
    }

    /**
     * Navigate to a category with the provided ID.
     * @param id
     */
    private navigateToId(id: string): void {
        let rootNode = this.activeNode;
        while (rootNode.prev) {
            rootNode = rootNode.prev;
        }

        const targetNode = this.configService.getProductById(rootNode, id);
        this.navigateTo(targetNode);
    }

    /**
     * Creates a new form object based on the current process' input(s).
     * @param response
     */
    private createForm(): void {
        this.newJobForm = this.formBuilder.group({
            csrf: new FormControl()
        });

        if (this.activeNode.inputs && this.activeNode.inputs.length) {
            for (let i = 0; i < this.activeNode.inputs.length; ++i) {
                // Currently we only have date types.
                const data = this.activeNode.inputs[i].type === ProductInputType.DATE ? new Date() : '';

                this.newJobForm.addControl('param' + i, new FormControl(data, [Validators.required]));
            }
        }
    }

    /**
     * Submits the form to the new job endpoint.
     */
    public onSubmit(formData: any) {
        this.submitted = true;

        if (this.newJobForm.valid) {
            this.jobService.newJobPost(formData).subscribe(data => {
                if (data.error) {
                    switch (data.error) {
                        case NewJobError.INPUT:
                            this.errorMsg = 'One or more of the input fields are invalid.';
                            break;
                        case NewJobError.TOKEN:
                            this.errorMsg = 'Invalid token. Please reload the page and try again.';
                            break;
                    }
                } else {
                    this.alertService.alert(AlertType.SUCCESS, 'The selected process has been started successfully.');
                    this.close.emit();
                }
            },
            err => {
                // If we get an Unauthorized response, the user is not allowed to use the app. Go back to the login page.
                if (err.status === 401) {
                    this.router.navigate(["login"]);
                } else if (err.status === 403) {
                    this.alertService.alert(AlertType.ERROR, 'You are not eligible to start a new process.');
                } else {
                    this.alertService.alert(AlertType.ERROR, 'An unexpected error happened, please try again later.');
                }
            });
        }
    }

    /**
     * Listener called when the user clicks on the Back button.
     */
    public goBack() {
        this.activeNode = this.activeNode.prev;
    }

    /**
     * Listener called when the user clicks on the help button of a process.
     * Navigates to the corresponding help page.
     */
    public onHelp() {
        this.getHelp.emit(this.activeNode.id);
    }

    /**
     * Saves the product configuration to generate the buttons from.
     */
    private async getConfig() {
        try {
            this.activeNode = await this.configService.getProductsAsync();

            // If we have a navigateId defined, we are coming from the help component. Navigate to the correct category.
            if (this.navigateId) {
                this.navigateToId(this.navigateId);
            }
        } catch (ex) {
            // If we get an Unauthorized response, the user is not allowed to use the app. Go back to the login page.
            if (ex.status === 401) {
                this.router.navigate(["login"]);
            } else {
                this.alertService.alert(AlertType.ERROR, "An unexpected error happened, please try again later.");
            }
        }
    }
}
