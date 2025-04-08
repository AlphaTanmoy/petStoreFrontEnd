import { Component } from '@angular/core';
import { BaseLoginComponent } from '../base-login/base-login.component';
import { USER_ROLE } from '../../../constants/Enums';

@Component({
  selector: 'app-seller-login',
  standalone: true,
  imports: [BaseLoginComponent],
  template: `
    <app-base-login
      title="Seller"
      role="ROLE_SELLER"
      otpEndpoint="http://localhost:8082/sent/otp"
      signInEndpoint="http://localhost:8082/signIn">
    </app-base-login>
  `
})
export class SellerLoginComponent {
  USER_ROLE = USER_ROLE;
}
