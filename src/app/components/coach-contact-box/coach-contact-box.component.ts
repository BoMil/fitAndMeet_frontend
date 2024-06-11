import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '../../_models/user';

@Component({
  selector: 'coach-contact-box',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './coach-contact-box.component.html',
  styleUrls: ['./coach-contact-box.component.scss',  '../../../styles/_cards.scss' ]
})
export class CoachContactBoxComponent {
    @Input() user!: User | null | undefined;
    @Input() defaultImage: string | null = '../../../assets/svg/user-icon.svg';

    reviewScore: number = 4; // TODO: Add real review property
}
