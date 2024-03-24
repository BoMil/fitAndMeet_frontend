import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { RegularTab } from 'src/app/_interfaces/regular-tab';

@Component({
    selector: 'app-regular-tabs',
    template: `
      <div class="tabs-wrapper" [class.arrows-visible]="tabChangeArrowsvisible">
          <div class="regular-tabs-container">
              <div class="regular-tab" *ngFor="let tab of tabs" [class.selected]="tab.selected" (click)="selectTab(tab)">
                  <div class="tab-name">
                      {{ tab.name }} 
                      <!-- <img [class.visible]="tab.selected" width="22" height="22" src="../../../../../assets/icons/check-circle.svg"/> -->
                  </div>
              </div>
  
              <div class="actions" *ngIf="tabChangeArrowsvisible">
                  <span class="action-item" (click)="previousTab()">
                      <i class="arrow-custom --small left"></i>
                  </span>
  
                  <span class="action-item" (click)="nextTab()">
                      <i class="arrow-custom --small right"></i>
                  </span>
              </div>
          </div>
      </div>
      `,
    styleUrls: ['./regular-tabs.component.scss']
  })
  export class RegularTabsComponent implements AfterViewInit {
      @Input() tabs: RegularTab[] = [];
      @Input() tabChangeArrowsvisible: boolean = false;
      @Output() tabSelected: EventEmitter<any> = new EventEmitter();
  
      selectedTab!: RegularTab;
  
      ngAfterViewInit(): void {
          for (let index = 0; index < this.tabs.length; index++) {
              const tab = this.tabs[index];
  
              if (tab.selected) {
                  this.selectedTab = tab;
                  break;
              }
          }
      }
  
      selectTab(selectedTab: RegularTab) {
          this.tabs.forEach(((tab: RegularTab) => {
              tab.selected = selectedTab.name === tab.name ? true : false;
          }));
          this.selectedTab = selectedTab;
          this.tabSelected.emit(selectedTab);
      }
  
      nextTab() {
          let nextTabIndex: number | null = null;
          for (let index = 0; index < this.tabs.length; index++) {
              const tab = this.tabs[index];
  
              if (nextTabIndex === index) {
                  tab.selected = true;
                  this.selectedTab = tab;
                  this.tabSelected.emit(this.selectedTab);
                  break;
              }
  
              const maxLength = this.tabs.length - 1;
  
              if (tab.selected && index !== maxLength) {
                  tab.selected = false;
                  nextTabIndex = index + 1;
              }
          }
  
      }
  
      previousTab() {
          let previousTabIndex: number | null = null;
          for (let index = 0; index < this.tabs.length; index++) {
              const tab = this.tabs[index];
              if (tab.selected && index !== 0) {
                  tab.selected = false;
                  previousTabIndex = index - 1;
                  break;
              }
          }
  
          if (previousTabIndex !== null) {
              this.tabs[previousTabIndex].selected = true;
              this.selectedTab = this.tabs[previousTabIndex];
              this.tabSelected.emit(this.selectedTab);
          }
      }
  }
