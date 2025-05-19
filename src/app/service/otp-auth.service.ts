import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { OtpRequest, OtpVerifyRequest, LoginResponse, ErrorResponse } from '../interfaces/auth.interface';
import { MICROSERVICE_NAME } from '../constants/Enums';
import { GetAPIEndpoint } from '../constants/endpoints';
import { NotificationService } from '../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class OtpAuthService {
  private currentEmailSubject = new BehaviorSubject<string | null>(null);
  private currentRoleSubject = new BehaviorSubject<MICROSERVICE_NAME | null>(null);

  currentEmail$ = this.currentEmailSubject.asObservable();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getEndpoints(role: MICROSERVICE_NAME) {
    return {
      otpEndpoint: `/sent/otp`,
      signInEndpoint: `/signIn`
    };
  }

  requestOtp(email: string, role: MICROSERVICE_NAME): Observable<any> {
    this.currentRoleSubject.next(role);
    const request: OtpRequest = { email };
    const { otpEndpoint } = this.getEndpoints(role);

    return this.http.post(otpEndpoint, request).pipe(
      tap(() => this.currentEmailSubject.next(email)),
      catchError(error => {
        console.error('Error requesting OTP:', error);
        return throwError(() => error);
      })
    );
  }

  verifyOtpAndLogin(otp: string): Observable<LoginResponse> {
    const email = this.currentEmailSubject.value;
    const role = this.currentRoleSubject.value;

    if (!email || !role) {
      return throwError(() => new Error('No email or role found. Please request OTP first.'));
    }

    const request: OtpVerifyRequest = { email, otp };
    const { signInEndpoint } = this.getEndpoints(role);

    return this.http.post<LoginResponse | ErrorResponse>(signInEndpoint, request).pipe(
      map(response => {
        if ('errorMessage' in response) {
          this.notificationService.showError(response.errorMessage);
          throw new Error(response.errorMessage);
        }
        this.notificationService.showSuccess('OTP verified successfully');
        return response as LoginResponse;
      }),
      tap(() => {
        this.currentEmailSubject.next(null);
        this.currentRoleSubject.next(null);
      }),
      catchError(error => {
        console.error('Error verifying OTP:', error);
        return throwError(() => error);
      })
    );
  }

  clearState(): void {
    this.currentEmailSubject.next(null);
    this.currentRoleSubject.next(null);
  }
}
