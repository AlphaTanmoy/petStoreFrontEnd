import { Component } from '@angular/core';
import { BaseLoginComponent } from '../base-login/base-login.component';
import { USER_ROLE } from '../../../constants/Enums';

@Component({
  selector: 'app-doctor-login',
  standalone: true,
  imports: [BaseLoginComponent],
  template: `
    <app-base-login
      title="Doctor"
      role="ROLE_DOCTOR">
    </app-base-login>
  `
})
export class DoctorLoginComponent {
  USER_ROLE = USER_ROLE;
}
