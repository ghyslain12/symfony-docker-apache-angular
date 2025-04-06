import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUri = environment.baseUri;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private jwtEnabled = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient, private router: Router) {
    this.loggedIn.next(!!this.getToken());
  }

  getLoggedInValue(): boolean {
    return this.loggedIn.getValue();
  }

  getLoggedInStatus(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getJwtEnabledStatus(): Observable<boolean> {
    return this.jwtEnabled.asObservable();
  }

  callConfig(): Observable<Object> {
    return this.http.get(`${this.baseUri}/api/config/jwt`);
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post(`${this.baseUri}/api/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
