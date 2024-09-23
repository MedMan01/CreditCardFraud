import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public users: any = {
    admin: { password: '1234', roles: ['ADMIN', 'Employe'] },
    newAdmin: {password: 'admin2023', roles: ['ADMIN']}

  };

  public username: any;
  public isAuthenticated: boolean = false;
  public roles: string[] = [];

  constructor(private router: Router) {}

  // Login logic
  public login(username: string, password: string) {
    if (this.users[username] && this.users[username].password === password) {
      this.username = username;
      this.isAuthenticated = true;
      this.roles = this.users[username].roles;
      return true;
    } else {
      return false;
    }
  }

  // Create user
  public createUser(username: string, password: string, roles: string[]) {
    this.users[username] = { password, roles };
  }

  // Modify user roles
  public modifyUser(username: string, roles: string[]) {
    if (this.users[username]) {
      this.users[username].roles = roles;
    }
  }

  // Delete user
  public deleteUser(username: string) {
    if (this.users[username]) {
      delete this.users[username];
    }
  }

  // Logout logic
  public logout() {
    this.isAuthenticated = false;
    this.roles = [];
    this.username = undefined;
    this.router.navigateByUrl('/login');
  }

  // Retrieve all users
  public getAllUsers() {
    return Object.keys(this.users).map((key) => ({
      username: key,
      roles: this.users[key].roles,
    }));
  }
}
