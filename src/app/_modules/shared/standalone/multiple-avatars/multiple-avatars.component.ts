import { Component, Input } from '@angular/core';
import { AvatarImageComponent } from '../avatar-image/avatar-image.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'multiple-avatars',
  standalone: true,
  imports: [
    AvatarImageComponent,
    CommonModule
  ],
  template: `
    <div class="multiple-avatars-container">
        <avatar-image *ngFor="let avatar of avatarUrls" [imgSrc]="avatar"/>
        <div *ngIf="avatarUrls.length > 2" class="info-box">
            <span class="count">+{{avatarUrls.length - 2}}</span>
        </div>
    </div>
  `,
  styles: `
    .multiple-avatars-container {
        height: 30px;

        avatar-image {
            position: absolute;

            &:nth-child(2) {
                left: 37px;
                z-index: 2;
            }
        }

        .info-box {
            position: absolute;
            left: 48px;
            background-color: var(--event-unavailable);
            height: 37px;
            width: 37px;
            border-radius: 50%;
            text-align: center;
            z-index: 3;
            font-size: 16px;
            padding-top: 8px;
            border: 2px solid white;


            .count {
                color: var(--text-grey-primary);
            }
        }
    }
`
})
export class MultipleAvatarsComponent {
    @Input() avatarUrls: string[] = [];
}
