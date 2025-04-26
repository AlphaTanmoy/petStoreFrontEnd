import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './Auth.Service'; // Adjust path if needed

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken(); // Assuming getToken() returns your JWT token

    if (token) {
      const cloned = request.clone({
        setHeaders: {
          Alpha: `Alpha ${token}`
        }
      });
      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }
}
