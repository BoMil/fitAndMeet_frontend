import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SearchOption } from 'src/app/_interfaces/search-option';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss', '../input-field/input-field.component.scss']
})
export class SearchFieldComponent implements OnInit, OnDestroy {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() isMandatory!: boolean;
    @Input() canValidate!: boolean;
    @Input() isDisabled: boolean = false;
    @Input() errorMessage: string = '';
    @Input() emptyFieldError: string = 'Required field';
    @Input() debounceMs: number = 500;
    @Input() type: 'text' | 'number' = 'text';
    @Input() inputText: FormControl = new FormControl('');
    @Output() searchTextChanged: EventEmitter<string> = new EventEmitter();
    @Output() optionSelected: EventEmitter<SearchOption> = new EventEmitter();

    @ViewChild('searchRef') searchRef!: ElementRef;
    @HostListener('document:mousedown', ['$event'])
    onOutsideClick(event: any): void {
      if (!this.searchRef?.nativeElement.contains(event.target)) {
        this.menuVisible = false;
      } else {
        this.menuVisible = true;
      }
    }

    menuVisible: boolean = false;
    validate: boolean = false;
    searchDebounceTimer: any = null;
	ngUnsubscribe = new Subject();

    ngOnInit(): void {
        this.inputText.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
            if (this.isDisabled) {
                return;
            }
            this.menuVisible = true;
            this.searchChanged(value);
        });
    }

    ngOnDestroy() {
		this.ngUnsubscribe.next(null);
		this.ngUnsubscribe.complete();
	}

    searchChanged(value?: string | undefined) {
        if (this.searchDebounceTimer) {
            clearTimeout(this.searchDebounceTimer);
        }

        this.searchDebounceTimer = setTimeout(() => {
            this.searchTextChanged.emit(value);
            this.searchDebounceTimer = null;
        }, this.debounceMs);
    }
}
