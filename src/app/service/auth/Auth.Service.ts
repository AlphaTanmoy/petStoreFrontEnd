import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GetAPIEndpoint } from '../../constants/endpoints';
import { USER_ROLE, MICROSERVICE_NAME } from '../../constants/Enums';
import { LoginRequest, LoginResponse, RefreshTokenRequest, TokenPayload } from '../../interfaces/auth.interface';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ROLE_KEY = 'userRole';
const USERNAME_KEY = 'username';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private loginStatusSubject = new BehaviorSubject<boolean>(this.isUserLoggedIn());
  private userRoleSubject = new BehaviorSubject<string>(this.getStoredUserRole());
  private usernameSubject = new BehaviorSubject<string>(this.getStoredUsername());

  loginStatus$ = this.loginStatusSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {}

  private login(email: string, password: string, microservice: MICROSERVICE_NAME, expectedRole: USER_ROLE): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { email, password };
    const endpoint = GetAPIEndpoint(microservice, 'login');

    return this.http.post<LoginResponse>(endpoint, loginRequest).pipe(
      tap(response => this.handleLoginResponse(response, expectedRole)),
      catchError(error => {
        console.error(`${expectedRole} login error:`, error);
        return throwError(() => error);
      })
    );
  }

  // Role-specific logins
  masterLogin(email: string, password: string) {
    return this.login(email, password, MICROSERVICE_NAME.AUTH, USER_ROLE.ROLE_MASTER);
  }

  adminLogin(email: string, password: string) {
    return this.login(email, password, MICROSERVICE_NAME.ADMIN, USER_ROLE.ROLE_ADMIN);
  }

  userLogin(email: string, password: string) {
    return this.login(email, password, MICROSERVICE_NAME.USER, USER_ROLE.ROLE_CUSTOMER);
  }

  sellerLogin(email: string, password: string) {
    return this.login(email, password, MICROSERVICE_NAME.SELLER, USER_ROLE.ROLE_SELLER);
  }

  doctorLogin(email: string, password: string) {
    return this.login(email, password, MICROSERVICE_NAME.USER, USER_ROLE.ROLE_DOCTOR);
  }

  raiderLogin(email: string, password: string) {
    return this.login(email, password, MICROSERVICE_NAME.USER, USER_ROLE.ROLE_RAIDER);
  }

  customerCareLogin(email: string, password: string) {
    return this.login(email, password, MICROSERVICE_NAME.USER, USER_ROLE.ROLE_CUSTOMER_CARE);
  }

  private handleLoginResponse(response: LoginResponse, expectedRole: string): void {
    if (response?.jwt && response?.refreshToken) {
      this.saveTokens(response.jwt, response.refreshToken);

      const decodedToken = this.jwtHelper.decodeToken<TokenPayload>(response.jwt);
      const actualRole = decodedToken?.role || '';
      const email = decodedToken?.email || '';

      if (actualRole.toUpperCase() === expectedRole.toUpperCase()) {
        this.saveUserRole(actualRole);
        this.saveUsername(email);
        this.loginStatusSubject.next(true);
      } else {
        console.error('Role mismatch in token');
        this.clearSession();
        throw new Error('Role mismatch');
      }
    } else {
      console.error('Invalid login response');
      this.clearSession();
      throw new Error('Invalid login response format');
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return USER_ROLE.GUEST;

    try {
      const decodedToken = this.jwtHelper.decodeToken<TokenPayload>(token);
      return decodedToken?.role || USER_ROLE.GUEST;
    } catch (err) {
      console.error('Token decode failed', err);
      return USER_ROLE.GUEST;
    }
  }

  getStoredUserRole(): string {
    return sessionStorage.getItem(USER_ROLE_KEY) || USER_ROLE.GUEST;
  }

  saveUserRole(role: string): void {
    sessionStorage.setItem(USER_ROLE_KEY, role);
    this.userRoleSubject.next(role);
  }

  isUserLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  refreshAccessToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return throwError(() => new Error('No refresh token'));

    const refreshRequest: RefreshTokenRequest = { refreshToken };
    const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.AUTH, 'refresh');

    return this.http.post<LoginResponse>(endpoint, refreshRequest).pipe(
      tap(response => {
        if (response?.jwt) {
          this.saveTokens(response.jwt, refreshToken);
        } else {
          throw new Error('Invalid refresh response');
        }
      }),
      catchError(err => {
        console.error('Refresh failed', err);
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout(): Observable<void> {
    this.clearSession();
    const token = this.getToken();

    if (token) {
      const endpoint = GetAPIEndpoint(MICROSERVICE_NAME.AUTH, 'logout');
      this.http.post<void>(endpoint, {}).subscribe({
        next: () => console.log('Logout success'),
        error: (err) => console.error('Logout failed', err)
      });
    }

    window.location.href = '/login';
    return of(void 0);
  }

  clearSession(): void {
    sessionStorage.clear();
    this.loginStatusSubject.next(false);
    this.userRoleSubject.next(USER_ROLE.GUEST);
    this.usernameSubject.next('');
  }

  getStoredUsername(): string {
    return sessionStorage.getItem(USERNAME_KEY) || '';
  }

  saveUsername(username: string): void {
    sessionStorage.setItem(USERNAME_KEY, username);
    this.usernameSubject.next(username);
  }

  getUsername(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const decodedToken = this.jwtHelper.decodeToken<TokenPayload>(token);
      return decodedToken?.email || '';
    } catch (err) {
      console.error('Decode failed', err);
      return '';
    }
  }
}
