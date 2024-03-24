import { Component, Input } from '@angular/core';
import { EventModel } from 'src/app/_models/event';

@Component({
  selector: 'app-event-box',
  templateUrl: './event-box.component.html',
  styleUrls: ['./event-box.component.scss']
})
export class EventBoxComponent {
    @Input() data!: EventModel;

}
