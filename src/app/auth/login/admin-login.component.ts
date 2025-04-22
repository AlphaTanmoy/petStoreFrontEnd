import { Component } from '@angular/core';
import { BaseLoginComponent } from './base-login/base-login.component';
import { USER_ROLE } from '../../constants/Enums';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [BaseLoginComponent],
  template: `
    <app-base-login
      title="Admin"
      role="ROLE_ADMIN">
    </app-base-login>
  `
})
export class AdminLoginComponent {
  USER_ROLE = USER_ROLE;
}
