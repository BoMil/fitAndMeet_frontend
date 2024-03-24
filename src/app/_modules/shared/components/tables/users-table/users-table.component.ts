import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
})
export class UsersTableComponent {
    @Input() set setData(users: User[] ) {
        this.dataSource = new MatTableDataSource<User>(users);
    }
    @Input() isSearchVisible: boolean = true;
    @Input() displayedColumns: string[] = ['id', 'name', 'role', 'dateOfBirth', 'gender', 'email', 'phone', 'username', 'actions' ];
    @Output() userEdit: EventEmitter<User> = new EventEmitter();
    @Output() userDelete: EventEmitter<User> = new EventEmitter();
    dataSource!: MatTableDataSource<User>;

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
