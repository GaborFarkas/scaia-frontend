import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertType } from 'src/app/models/alert.model';
import { EntryType, Product } from 'src/app/models/product.model';
import { HomePage } from 'src/app/pages/home';
import AlertService from 'src/app/services/alert.service';
import ConfigService from 'src/app/services/config.service';

@Component({
    selector: 'app-addNewJob',
    templateUrl: './addNewJob.component.html',
    styleUrls: ['./addNewJob.component.css']
})

export class AddNewJobComponent implements OnInit {
    public activeNode: Product;

    @Input() navigateId: string;

    @Output() close = new EventEmitter();
    @Output() showMap = new EventEmitter<string>();
    @Output() getHelp = new EventEmitter<string>();

    constructor(
        private configService: ConfigService,
        private alertService: AlertService,
        private router: Router) { }

    ngOnInit(): void {
        this.getConfig();
    }

    /**
     * Listener called when the user clicks on a GUI category button.
     * @param item
     */
    public navigateTo(item: Product) {
        this.activeNode = item;
        if (item.type === EntryType.MAP) {
            this.showMap.emit(item.id);
            this.close.emit();
        }
    }

    /**
     * Navigate to a category with the provided ID.
     * @param id
     */
    private navigateToId(id: string) {
        let rootNode = this.activeNode;
        while (rootNode.prev) {
            rootNode = rootNode.prev;
        }

        const targetNode = this.configService.getProductById(rootNode, id);
        this.navigateTo(targetNode);
    }

    /**
     * Listener called when the user clicks on the Back button.
     */
    public goBack() {
        this.activeNode = this.activeNode.prev;
    }

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
