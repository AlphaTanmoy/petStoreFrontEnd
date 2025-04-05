import { Component } from '@angular/core';
import { BaseLoginComponent } from '../base-login/base-login.component';
import { USER_ROLE } from '../../constants/Enums';

@Component({
  selector: 'app-master-login',
  standalone: true,
  imports: [BaseLoginComponent],
  template: `
    <app-base-login
      title="Master"
      role="ROLE_MASTER">
    </app-base-login>
  `
})
export class MasterLoginComponent {
  USER_ROLE = USER_ROLE;
}
