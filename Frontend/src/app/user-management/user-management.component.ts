import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  users: any[] = [];
  newUsername: string = '';
  newPassword: string = '';
  newRoles: string[] = [];
  selectedRoles: string[] = [];

  constructor(public authService: AuthService) {
    this.loadUsers();
  }

  loadUsers() {
    this.users = this.authService.getAllUsers();
  }

  createUser() {
    if (this.newUsername && this.newPassword && this.newRoles.length > 0) {
      this.authService.createUser(this.newUsername, this.newPassword, this.newRoles);
      this.loadUsers();
      this.newUsername = '';
      this.newPassword = '';
      this.newRoles = [];
    } else {
      alert('Please fill all fields');
    }
  }

  deleteUser(username: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(username);
      this.loadUsers();
    }
  }

  modifyUser(username: string) {
    if (this.selectedRoles.length > 0) {
      this.authService.modifyUser(username, this.selectedRoles);
      this.loadUsers();
    } else {
      alert('Please select at least one role');
    }
  }
}
