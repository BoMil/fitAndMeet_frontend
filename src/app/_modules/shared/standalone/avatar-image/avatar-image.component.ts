import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'avatar-image',
  standalone: true,
  imports: [ CommonModule ],
  template: `
    <div class="avatar-container">
        <img [ngStyle]="{ height: height, width: width }" class="image" src="{{ imgSrc ? imgSrc : defaultImage }}" alt="Image">
    </div>
  `,
  styles: `
    .avatar-container {
        .image {
            border: 2px solid white;
            border-radius: 50%;
        }
    }
  `
})
export class AvatarImageComponent {
    @Input() imgSrc: string | null = null;
    @Input() height: string = '37px';
    @Input() width: string = '37px';
    @Input() defaultImage: string | null = '../../../../../assets/svg/user-icon.svg';
}
