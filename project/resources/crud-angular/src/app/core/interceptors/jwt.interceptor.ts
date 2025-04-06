import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.endsWith('/api/config/jwt')) {
      return next.handle(request);
    }

    return this.authService.getJwtEnabledStatus().pipe(
      switchMap(jwtEnabled => {
        if (!jwtEnabled) {
          return next.handle(request);
        }

        const token = this.authService.getToken();
        if (token) {
          const authReq = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(authReq);
        }
        return next.handle(request);
      })
    );
  }
}

export function jwtInterceptorFn(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  const interceptor = new JwtInterceptor(authService);
  return interceptor.intercept(req, { handle: next } as HttpHandler);
}
