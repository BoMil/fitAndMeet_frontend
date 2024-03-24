import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { UserApiService } from 'src/app/_services/api-services/user-api.service';

export enum UsersContent { TableView, EditUserView, CreateUserView }
@Component({
  selector: 'app-users-admin-dashboard',
  templateUrl: './users-admin-dashboard.component.html',
  styles: [`
    .admin-users-container {
        padding: 1rem;

        .buttons-container {
            margin-bottom: 1rem;
        }
    }
  `],
})
export class UsersAdminDashboardComponent implements OnInit {
    allUsers: User[] = [];
    view = UsersContent;
    currentView: UsersContent = UsersContent.TableView;
    userToEdit: User | null = null;

    constructor(
        private userApiService: UserApiService,
        private router: Router,
        private toastr: ToastrService,
    ) {}

    ngOnInit(): void {
        this.getAllUsers();
    }

    editUser(user: User) {
        this.userToEdit = user;
        this.currentView = UsersContent.EditUserView;
    }

    deleteUser(user: User) {
        // console.log('deleteCompany', company)
        this.userApiService.removeUser(user.id).subscribe({
            next: (data) => {
                this.toastr.success('User removed');
                this.getAllUsers();
            },
            error: (err) => {
                this.toastr.error('Failed to delete user');
                console.log('deleteUser', err);
            }
        }); 
    }

    onUserCreatedOrUpdated() {
        console.log('onUserCreatedOrUpdated');
        this.currentView = UsersContent.TableView;
        this.userToEdit = null;
        this.getAllUsers();
    }

    getAllUsers() {
        this.userApiService.getAllUsers().subscribe({
            next: (data) => {
                this.allUsers = [];
                for (let index = 0; index < data.length; index++) {
                    const user: User = new User(data[index]);
                    this.allUsers.push(user);
                }
            },
            error: (err) => {
                this.toastr.error('Failed to get all users');
                console.log('getAllUsers', err);
            }
        });
    }
}
