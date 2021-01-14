import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertType } from 'src/app/models/alert.model';
import { getNodeById, Product } from 'src/app/models/product.model';
import AlertService from 'src/app/services/alert.service';
import ConfigService from 'src/app/services/config.service';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['../addNewJob/addNewJob.component.css']
})
export class HelpComponent implements OnInit {
    public activeNode: Product;

    @Input() navigateId: string;

    @Output() navigateBack = new EventEmitter();

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

        if (this.activeNode.id && !this.activeNode.items) {
            this.configService.getHelpCardsAsync(this.activeNode);
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

        this.navigateTo(getNodeById(rootNode, id));
    }

    /**
     * Listener called when the user clicks on the Back button.
     * If there is a navigateId, we just emit a back event, so the home page can go back to the correct addNewJob category.
     */
    public goBack() {
        if (this.navigateId) {
            this.navigateBack.emit();
        } else {
            this.activeNode = this.activeNode.prev;
        }
    }

    /**
     * Saves the product configuration to generate the buttons from.
     */
    private async getConfig() {
        try {
            this.activeNode = await this.configService.getHelpAsync();

            // If we have a navigateId defined, we are coming from the addNewJob component. Navigate to the correct category.
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
