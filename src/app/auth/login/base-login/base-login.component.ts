import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { OtpInputComponent } from '../../../components/otp-input/otp-input.component';
import { AuthService } from '../../../core/services/auth.service';
import { MICROSERVICE_NAME, USER_ROLE } from '../../../constants/Enums';
import { OtpDialogComponent } from '../../../components/otp-dialog/otp-dialog.component';
import {GetAPIEndpoint} from '../../../constants/endpoints'
@Component({
  selector: 'app-base-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    OtpInputComponent,
    MatDialogModule,
    MatRadioModule
  ],
  templateUrl: './base-login.component.html',
  styleUrls: ['./base-login.component.css']
})
export class BaseLoginComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() role: string = '';

  // Default endpoints - will be overridden based on role
  otpEndpoint: string = '';
  signInEndpoint: string = '';

  loginForm: FormGroup;
  isLoading = false;
  otpSent = false;
  userEmail = '';
  otpValue: string = '';
  hidePassword = true;

  // Login method selection
  loginMethod: 'password' | 'otp' = 'password';

  // Timer properties
  otpTimer: number = 60; // 60 seconds
  timerInterval: any;
  canResendOtp: boolean = false;

  // JWT helper
  private jwtHelper = new JwtHelperService();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      otp: [{ value: '', disabled: true }]
    });

    // Update password field validation based on login method
    this.loginForm.get('password')?.setValidators(Validators.required);
    this.loginForm.get('password')?.updateValueAndValidity();
  }

  ngOnInit(): void {
    // Set endpoints based on role
    this.setEndpointsByRole();
    console.log(this.setEndpointsByRole())
    // Subscribe to login method changes
    this.loginForm.get('password')?.setValidators(this.loginMethod === 'password' ? Validators.required : null);
    this.loginForm.get('password')?.updateValueAndValidity();
  }

  private setEndpointsByRole(): void {
    switch (this.role) {
      case USER_ROLE.ROLE_MASTER:
        this.otpEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.AUTH,'')}sent/otp`;
        this.signInEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.AUTH,'')}signIn`;
        break;
      case USER_ROLE.ROLE_ADMIN:
        this.otpEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.ADMIN,'')}sent/otp`;
        this.signInEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.ADMIN,'')}signIn`;
        break;
      case USER_ROLE.ROLE_DOCTOR:
        this.otpEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.DOC,'')}sent/otp`;
        this.signInEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.DOC,'')}signIn`;
        break;
      case USER_ROLE.ROLE_SELLER:
        this.otpEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.SELLER,'')}sent/otp`;
        this.signInEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.SELLER,'')}signIn`;
        break;
      case USER_ROLE.ROLE_CUSTOMER:
        this.otpEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.USER,'')}sent/otp`;
        this.signInEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.USER,'')}signIn`;
        break;
      case USER_ROLE.ROLE_RAIDER:
        this.otpEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.MANAGEMENT,'')}sent/otp`;
        this.signInEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.MANAGEMENT,'')}signIn`;
        break;
      case USER_ROLE.ROLE_CUSTOMER_CARE:
        this.otpEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.MANAGEMENT,'')}sent/otp`;
        this.signInEndpoint = `${GetAPIEndpoint(MICROSERVICE_NAME.MANAGEMENT,'')}signIn`;
        break;
      default:
        // Default endpoints remain unchanged
        break;
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;

    if (this.loginMethod === 'password') {
      if (!this.otpSent) {
        this.loginWithEmailPassword();
      } else {
        this.verifyOtp();
      }
    } else {
      // OTP login method
      if (!this.otpSent) {
        this.requestOtp();
      } else {
        this.verifyOtp();
      }
    }
  }

  private loginWithEmailPassword(): void {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.userEmail = email;

    // First, try to login with email and password
    this.http.post<any>(this.signInEndpoint, {
      email: email,
      password: password
    }).subscribe({
      next: (response) => {
        if (response.status && response.role === this.role) {
          // Check if 2FA is required
          if (response.requiresOtp) {
            // If 2FA is required, request OTP
            this.requestOtp();
          } else {
            // If 2FA is not required, complete login
            this.completeLogin(response);
          }
        } else {
          this.snackBar.open('Invalid credentials or role mismatch', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        this.snackBar.open(error.error?.errorMessage || 'Login failed', 'Close', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  public requestOtp(): void {
    if (!this.canResendOtp && this.otpSent) {
      this.showWaitDialog();
      return;
    }

    const email = this.loginForm.get('email')?.value;
    this.userEmail = email;

    this.http.post<any>(this.otpEndpoint, { email }).subscribe({
      next: (response) => {
        // Check if the response indicates a failure
        if (!response.status) {
          // Show error dialog for invalid email
          this.dialog.open(OtpDialogComponent, {
            width: '300px',
            data: {
              title: 'Invalid Email',
              message: response.message || 'The email address you entered is not registered. Please check and try again.'
            }
          });
          this.isLoading = false;
          return;
        }

        // If successful, proceed with OTP flow
        this.otpSent = true;
        this.loginForm.get('otp')?.enable();
        this.snackBar.open(response.message || 'OTP sent successfully!', 'Close', { duration: 3000 });
        this.startOtpTimer();
      },
      error: (error) => {
        this.snackBar.open(error.error?.errorMessage || 'Failed to send OTP', 'Close', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private verifyOtp(): void {
    const otp = this.otpValue;

    this.http.post<any>(this.signInEndpoint, {
      email: this.userEmail,
      otp: otp
    }).subscribe({
      next: (response) => {
        if (response.status && response.role === this.role) {
          this.completeLogin(response);
        } else {
          this.showWrongOtpDialog();
        }
      },
      error: (error) => {
        this.showWrongOtpDialog();
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private completeLogin(response: any): void {
    this.authService.saveTokens(response.jwt, response.refreshToken);
    this.authService.saveUserRole(response.role);

    // Show success dialog
    this.showSuccessDialog();

    // Navigate based on role
    switch(response.role) {
      case USER_ROLE.ROLE_MASTER:
        this.router.navigate(['/master/dashboard']);
        break;
      case USER_ROLE.ROLE_ADMIN:
        this.router.navigate(['/admin/dashboard']);
        break;
      case USER_ROLE.ROLE_DOCTOR:
        this.router.navigate(['/doctor/dashboard']);
        break;
      case USER_ROLE.ROLE_SELLER:
        this.router.navigate(['/seller/dashboard']);
        break;
      case USER_ROLE.ROLE_CUSTOMER:
        this.router.navigate(['/customer/dashboard']);
        break;
      case USER_ROLE.ROLE_RAIDER:
        this.router.navigate(['/raider/dashboard']);
        break;
      case USER_ROLE.ROLE_CUSTOMER_CARE:
        this.router.navigate(['/customer-care/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }

    // Force reload to ensure navbar updates
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  resendOtp(): void {
    this.otpSent = false;
    this.loginForm.get('otp')?.disable();
    this.loginForm.get('otp')?.setValue('');
    this.otpValue = ''; // Reset the OTP value
    this.requestOtp();
  }

  onOtpChange(otp: string): void {
    console.log('OTP changed:', otp); // Add logging to debug
    this.otpValue = otp;

    // Update the form control value
    this.loginForm.patchValue({ otp: otp });

    // Log the form state
    console.log('Form valid:', this.loginForm.valid);
    console.log('OTP length:', otp.length);
    console.log('OTP value:', otp);
  }

  // Timer methods
  startOtpTimer(): void {
    this.canResendOtp = false;
    this.otpTimer = 60;

    // Clear any existing timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Start new timer
    this.timerInterval = setInterval(() => {
      this.otpTimer--;
      if (this.otpTimer <= 0) {
        clearInterval(this.timerInterval);
        this.canResendOtp = true;
      }
    }, 1000);
  }

  // Dialog methods
  showWaitDialog(): void {
    this.dialog.open(OtpDialogComponent, {
      width: '300px',
      data: {
        title: 'Please Wait',
        message: `Please wait ${this.otpTimer} seconds before requesting a new OTP.`
      }
    });
  }

  showWrongOtpDialog(): void {
    this.dialog.open(OtpDialogComponent, {
      width: '300px',
      data: {
        title: 'Wrong OTP',
        message: 'The OTP you entered is incorrect. Please try again.'
      }
    });
  }

  showSuccessDialog(): void {
    this.dialog.open(OtpDialogComponent, {
      width: '300px',
      data: {
        title: 'Success',
        message: 'OTP verified successfully!'
      }
    });
  }

  // Add method to handle login method changes
  onLoginMethodChange(): void {
    const passwordControl = this.loginForm.get('password');
    if (this.loginMethod === 'password') {
      passwordControl?.setValidators(Validators.required);
    } else {
      passwordControl?.clearValidators();
      passwordControl?.setValue('');
    }
    passwordControl?.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    // Clear the timer interval when component is destroyed
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
