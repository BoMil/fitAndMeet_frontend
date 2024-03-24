import { Injectable } from '@angular/core';

export type ModaLType = 'event-form' | 'create-event-form' | 'signin' | 'notification-details' | '';

@Injectable({
	providedIn: 'root',
})
export class ModalService {
    isModalVisible: boolean = false;
    currentModal: ModaLType | null = null;

    closeModal() {
        this.isModalVisible = false;
    }

    openEditEventFormModal() {
        this.isModalVisible = true;
        this.currentModal = 'event-form';
    }

    openCreateEventFormModal() {
        this.isModalVisible = true;
        this.currentModal = 'create-event-form';
    }

    openSignInModal() {
        this.isModalVisible = true;
        this.currentModal = 'signin';
    }

    openNotificationDetailsModal() {
        this.isModalVisible = true;
        this.currentModal = 'notification-details';
    }
}
