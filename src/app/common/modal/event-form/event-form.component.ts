import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventFormStateService } from '../../../_global-state-services/events/event-form-state.service';
import { ModalService } from 'src/app/_services/modal.service';

@Component({
	selector: 'app-event-form',
	templateUrl: './event-form.component.html',
	styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent {
    @Input() isCreateEvent: boolean = false;

	eventForm = new FormGroup({
		eventDescription: this.stateService.eventDescription,
		numberOfAttendees: this.stateService.numberOfAttendees,
	});

	isInitialLoad: boolean = true;
	isSubmitted: boolean = false;

	constructor(public stateService: EventFormStateService, public modalService: ModalService) {}

	ngOnDestroy() {
        this.stateService.resetEventFormState();
	}

	saveEventChanges() {
        this.isSubmitted = true;
		if (this.eventForm.status !== 'VALID') {
			return;
		}
		this.stateService.updateEvent();
	}

	deleteEvent() {
        // TODO: Add modal to ask user if he is sure he wants to delete
		this.stateService.deleteEvent();
	}

	closeModal() {
		if (this.isInitialLoad) {
			this.isInitialLoad = false;
			return;
		}

		this.modalService.closeModal();
	}

    createEvent() {
        this.isSubmitted = true;
		if (this.eventForm.status !== 'VALID') {
			return;
		}

        this.stateService.createEvent();
    }
}
