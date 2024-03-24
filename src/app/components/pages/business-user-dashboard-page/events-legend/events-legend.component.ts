import { Component } from '@angular/core';

@Component({
  selector: 'app-events-legend',
  template: `
    <div class="events-legend-box">
        <div class="event">Accepted <span class="accepted"></span></div>
        <div class="event pending">Pending <span class="pending"></span></div>
        <div class="event declined">Declined <span class="declined"></span></div>
        <div class="event available">Available <span class="available"></span></div>
    </div>
  `,
  styleUrls: ['./events-legend.component.scss']
})
export class EventsLegendComponent {

}
