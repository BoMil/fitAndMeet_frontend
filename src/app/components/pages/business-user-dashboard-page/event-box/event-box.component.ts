import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventModel, UserEvent } from 'src/app/_models/event';
import { AvatarImageComponent } from '../../../../_modules/shared/standalone/avatar-image/avatar-image.component';
import { MultipleAvatarsComponent } from '../../../../_modules/shared/standalone/multiple-avatars/multiple-avatars.component';

@Component({
  selector: 'app-event-box',
  templateUrl: './event-box.component.html',
  styleUrls: ['./event-box.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    AvatarImageComponent,
    MultipleAvatarsComponent
  ]
})
export class EventBoxComponent implements OnInit {
    @Input() data!: EventModel;
    @Input() isEndUser: boolean = false;
    @Output() bookEvent: EventEmitter<EventModel> = new EventEmitter();
    @Output() acceptEvent: EventEmitter<EventModel> = new EventEmitter();
    @Output() declineEvent: EventEmitter<EventModel> = new EventEmitter();

    pendingAvatars: string[] = [];
    acceptedAvatars: string[] = [];

    ngOnInit(): void {
        // Only end users should see pending users in a form of a list, one under another
        if (this.isEndUser && this.data?.sortedEventUsers?.pendingUsers?.length) {
            this.pendingAvatars = this.data?.sortedEventUsers.pendingUsers.map((el: UserEvent) => el.userAvatar);
        }

        if (this.data?.sortedEventUsers?.acceptedUsers?.length) {
            this.acceptedAvatars = this.data?.sortedEventUsers.acceptedUsers.map((el: UserEvent) => el.userAvatar);
        }
    }
}
