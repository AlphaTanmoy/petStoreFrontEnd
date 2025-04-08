import { Component } from '@angular/core';
import { BaseLoginComponent } from '../base-login/base-login.component';
import { USER_ROLE } from '../../../constants/Enums';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [BaseLoginComponent],
  template: `
    <app-base-login
      title="Customer"
      role="USER_ROLE">
    </app-base-login>
  `
})
export class CustomerLoginComponent {
  USER_ROLE = USER_ROLE;
}
