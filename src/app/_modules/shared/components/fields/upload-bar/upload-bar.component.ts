import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload-bar',
  template: `
    <div class="upload-bar-container">
        <div class="label-box">
            <div class="left-label" >
                <label>{{ leftLabel }} </label>
                <app-input-label *ngIf="mandatoryLabel" [bolded]="true" [label]="mandatoryLabel" [isMandatory]="true"></app-input-label>
            </div>
            <div class="right-label">
                <label >{{ rightLabel }}</label>
            </div>
        </div>
        <div class="bar-box" [ngClass]="{'rejected-border': isRejected === true}">
            <div class="action-area" (click)="fileUpload.click()">Upload</div>
            <input type="file" class="file-input"(change)="onFileSelected($event)" #fileUpload>
            <div class="file-area">{{ fileText }}</div>
        </div>
        <div [class.hidden]="maxSizeErrorMessage === '' && fileText !== 'No file chosen'" class="form-control-error">
            <ng-container *ngIf="fileText === 'No file chosen' && canValidate">Required field</ng-container>
            <ng-container *ngIf="maxSizeErrorMessage !== ''">{{ fileText === 'No file chosen' && canValidate ? ', ' : ''}}{{ maxSizeErrorMessage }}</ng-container>
        </div>
    </div>
  `,
  styleUrls: ['./upload-bar.component.scss'],
})
export class UploadBarComponent implements OnInit {
    @Input() mandatoryLabel: string = '';
    @Input() leftLabel: string = '';
    @Input() rightLabel: string = '';
    @Input() maxSizeErrorMessage: string = '';
    @Input() maxSizeInKilobytes: number = 1000;
    @Input() canValidate!: boolean;
    @Input() allowedExtensions: string[]= ['jpg', 'jpeg', 'png'];
    @Output() dataForServerUpload: EventEmitter<File | null> = new EventEmitter<File | null>();
    @Input() fileText: string = '';
    @Output() fileTextChange: EventEmitter<string | null> = new EventEmitter<string | null>();
    @Input() isRejected: boolean = false;

    constructor() { }

    ngOnInit(): void {
        if (!this.fileText)
            this.fileText = 'No file chosen';
    }

    onFileSelected(event: any) {
        const file:File = event.target.files[0];
        this.maxSizeErrorMessage = '';

        if (file) {
            const fileSizeInKb = file.size / 1000;
            // Check the max size
            if (this.maxSizeInKilobytes < fileSizeInKb) {
                this.maxSizeErrorMessage = `Max. file size is ${this.maxSizeInKilobytes}kb`;
                this.dataForServerUpload.emit(null);
                return;
            }

            // Check if the file extension is valid
            if (!this.isFileExtensionValid(file.type)) {
                this.maxSizeErrorMessage = `File extension is not allowed`;
                this.dataForServerUpload.emit(null);
                return;
            }

            this.fileText = file.name;
            this.fileTextChange.emit(this.fileText);
            this.dataForServerUpload.emit(file);
        }
    }

    isFileExtensionValid(extension: string): boolean {
        for (let index = 0; index < this.allowedExtensions.length; index++) {
            const element = this.allowedExtensions[index];
            if (extension.includes(element)) {
                return true;
            }
        }
        return false;
    }
}
