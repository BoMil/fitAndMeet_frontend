import { Component } from '@angular/core';
import { ModalService } from 'src/app/_services/modal.service';

@Component({
	selector: 'app-modal',
	template: `
		<div class="modal-container" >
			<ng-container [ngSwitch]="modalService.currentModal">
				<app-event-form *ngSwitchCase="'event-form'" />
				<app-event-form *ngSwitchCase="'create-event-form'" [isCreateEvent]="true" />
				<app-sign-in *ngSwitchCase="'signin'" />
				<app-notification-details *ngSwitchCase="'notification-details'" />
				<div *ngSwitchDefault>
					<p>Sorry, you are trying to open unexisting modal dialog.</p>
				</div>
			</ng-container>
		</div>
	`,
	styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(public modalService: ModalService) { }
}