import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { AUTH_TOKEN, AUTH_TOKEN_PREFIX } from '../../constants/KeywordsAndConstrants';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);
    const notificationService = this.injector.get(NotificationService);
    const token = authService.getToken();
    let cloned = req;
    if (token) {
      cloned = req.clone({
        setHeaders: {
          [AUTH_TOKEN]: `${AUTH_TOKEN_PREFIX}${token}`
        }
      });
    }
    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        let msg = 'An unexpected error occurred.';
        if (error.error && typeof error.error === 'object' && error.error.errorMessage) {
          msg = error.error.errorMessage;
        } else if (error.error && error.error.message) {
          msg = error.error.message;
        } else if (error.message) {
          msg = error.message;
        }
        notificationService.showError(msg);
        return throwError(() => error);
      })
    );
  }
}
