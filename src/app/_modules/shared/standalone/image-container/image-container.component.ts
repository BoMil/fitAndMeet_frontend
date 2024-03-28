import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-container',
  standalone: true,
  imports: [],
  template: `
    <div class="image-container">
        <img class="image" src="{{ imgSrc ? imgSrc : defaultImage }}" alt="Image">
        <div class="label">{{ label }}</div>
    </div>
  `,
  styles: `
    .image-container {
        margin: auto;
        width: fit-content;

        .image {
            border: 1px solid var(--border-input-primary-color);
            border-radius: 8px;
            width: 14rem;
            height: 14rem;
        }
        .label {
            text-align: center;
            color: var(--carousel-icon-color);
        }

    }
  `
})
export class ImageContainerComponent {
    @Input() label: string = '';
    @Input() imgSrc: string | null = null;
    @Input() defaultImage: string | null = '../../../../../assets/svg/user-icon.svg';

}
