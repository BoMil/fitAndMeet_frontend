import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CollapseItem } from 'src/app/_modules/shared/_interfaces/collapse-item';

@Component({
  selector: 'app-collapsible-item',
  templateUrl: './collapsible-item.component.html',
  styleUrls: ['./collapsible-item.component.scss']
})
export class CollapsibleItemComponent {
    @Input() closeWhenAnotherSectionOpened: boolean = true;
    @Input() itemId: number | string = '';
    @Input() sectionData: any;
    @Input() sectionTitle!: string;
    @Input() set setSectionState(item: CollapseItem | null) {
        // console.log('setSectionState', item);
        if (!this.closeWhenAnotherSectionOpened || !item) {
            return;
        }

        if (this.itemId === item.data?.id) {
            this.isSectionOpened = item.isOpened;
        } else {
            this.isSectionOpened = false;
        }
    }
    @Output() sectionToggled: EventEmitter<CollapseItem> = new EventEmitter();

    isSectionOpened: boolean = false;

    toggleSection() {
        if (!this.closeWhenAnotherSectionOpened) {
            this.isSectionOpened = !this.isSectionOpened;
        }

        this.sectionToggled.emit({
            // If closeWhenAnotherSectionOpened is true that means the state of this item
            // will be changed from parent component, that is why we added this logic
            isOpened: !this.closeWhenAnotherSectionOpened ? this.isSectionOpened : !this.isSectionOpened,
            id: this.itemId,
            data: this.sectionData
        });
    }

}
