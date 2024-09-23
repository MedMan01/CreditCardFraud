import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  username: string = '';
  password: string = '';
  roles: string[] = [];

  constructor(private authService: AuthService) {}

  onCreateAccount() {
    if (this.username && this.password && this.roles.length) {
      this.authService.createUser(this.username, this.password, this.roles);
      alert('User created successfully!');
    } else {
      alert('Please fill in all fields');
    }
  }
}
