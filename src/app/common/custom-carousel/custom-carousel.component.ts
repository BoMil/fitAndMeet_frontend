import { Component, ElementRef, Input } from '@angular/core';
import { InfoBoxData } from 'src/app/_models/info-box-data';

@Component({
  selector: 'app-custom-carousel',
  template: `
    <div class="carousel-container">
        <div class="carousel-list">
            <div class="carousel-item" *ngFor="let item of carouselItems; let i = index" [class.active]="i === selectedIndex">
                <app-info-box [data]="item"/>
            </div>
        </div>
        <mat-icon [class.disabled]="previousDisabled" (click)="previousClicked()" class="left-icon">keyboard_arrow_left</mat-icon>
        <mat-icon [class.disabled]="nextDisabled" (click)="nextClicked()" class="right-icon">keyboard_arrow_right</mat-icon>
    </div>
  `,
  styleUrls: ['./custom-carousel.component.scss']
})
export class CustomCarouselComponent {
    selectedIndex: number = 0;
    previousDisabled: boolean = false;
    nextDisabled: boolean = false;
    carouselItems: InfoBoxData[] = [];

    @Input() set setCarouselItems(items: InfoBoxData[]) {
        this.carouselItems = items;
        this.checkIfBtnsDisabled();
    };

    constructor(private craouselContainer: ElementRef) {}

    checkIfBtnsDisabled() {
        this.nextDisabled = !this.carouselItems.length || !this.selectedIndex;
        this.previousDisabled = !this.carouselItems.length || this.selectedIndex === this.carouselItems.length - 1;
    }

    previousClicked() {
        if (this.previousDisabled) {
            return;
        } 
        let nodeItems: NodeList = this.craouselContainer.nativeElement?.querySelectorAll(".carousel-item");

        const rows = Array.from(nodeItems) as HTMLElement[];
        rows.forEach((el: HTMLElement) => {
            let itemsMarginLeft = 3;

            let marginCorrectionValue = (this.selectedIndex + 1) * itemsMarginLeft;
            let moveValue = (100 * (this.selectedIndex + 1)) + marginCorrectionValue;
            el.style.transform = `translateX(-${moveValue}%)`;
        });
        this.selectedIndex = this.carouselItems.length - 1 !== this.selectedIndex ? this.selectedIndex + 1 : this.selectedIndex;
        this.checkIfBtnsDisabled();
    }

    nextClicked() {
        if (this.nextDisabled) {
            return;
        } 

        let nodeItems: NodeList = this.craouselContainer.nativeElement?.querySelectorAll(".carousel-item");

        const rows = Array.from(nodeItems) as HTMLElement[];
        rows.forEach((el: HTMLElement) => {
            let itemsMarginLeft = 3;
            let marginCorrectionValue = this.selectedIndex === 1 ? 0 : (this.selectedIndex - 1) * itemsMarginLeft;
            let moveValue = (100 * (this.selectedIndex - 1)) + marginCorrectionValue;
            el.style.transform = `translateX(-${moveValue}%)`;
        });
        this.selectedIndex = this.selectedIndex > 0 ? this.selectedIndex - 1 : this.selectedIndex;
        this.checkIfBtnsDisabled();
    }
}
