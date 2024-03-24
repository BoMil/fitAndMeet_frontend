import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Company } from 'src/app/_models/company';

@Component({
  selector: 'app-companies-table',
  templateUrl: './companies-table.component.html',
})
export class CompaniesTableComponent {
    @Input() set setData(companies: Company[] ) {
        this.dataSource = new MatTableDataSource<Company>(companies);
    }
    @Input() isSearchVisible: boolean = true;
    @Input() displayedColumns: string[] = ['id', 'name', 'address', 'created', 'updated', 'actions' ];
    @Output() companyEdit: EventEmitter<Company> = new EventEmitter();
    @Output() companyDelete: EventEmitter<Company> = new EventEmitter();
    dataSource!: MatTableDataSource<Company>;

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
