import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { USER_ROLE } from '../../constants/Enums';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  private authService = inject(AuthService);
  readonly userRole = this.authService.getUserRole();
  readonly isPrivilegedUser = [USER_ROLE.ROLE_ADMIN, USER_ROLE.ROLE_MASTER, USER_ROLE.ROLE_DOCTOR].includes(this.userRole as USER_ROLE);

  readonly currentYear = new Date().getFullYear();

}
