import { Component, Input } from '@angular/core';
import { User } from '../../_models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'coach-info-box',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './coach-info-box.component.html',
  styleUrls: ['./coach-info-box.component.scss',  '../../../styles/_cards.scss' ]
})
export class CoachInfoBoxComponent {
    @Input() user!: User | null | undefined;
    @Input() defaultImage: string | null = '../../../assets/svg/user-icon.svg';

    reviewScore: number = 4; // TODO: Add real review property
    isLiked: boolean = true; // TODO: Add real property
}
