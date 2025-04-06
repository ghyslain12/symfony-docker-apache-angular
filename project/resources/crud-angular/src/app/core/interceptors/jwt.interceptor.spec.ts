import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { JwtInterceptor, jwtInterceptorFn } from './jwt.interceptor';
import { AuthService } from '../services/auth/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let authService: jasmine.SpyObj<AuthService>;
  let mockHandler: jasmine.SpyObj<HttpHandler>;

  const mockToken = 'mock-jwt-token';
  const mockRequest = new HttpRequest('GET', '/api/test');
  const mockConfigRequest = new HttpRequest('GET', '/api/config/jwt');

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getToken', 'getJwtEnabledStatus']);
    mockHandler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        JwtInterceptor,
        { provide: AuthService, useValue: authService },
        { provide: HttpHandler, useValue: mockHandler },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    interceptor = TestBed.inject(JwtInterceptor);

    authService.getJwtEnabledStatus.and.returnValue(of(true));
    authService.getToken.and.returnValue(null);
    mockHandler.handle.and.returnValue(of(new HttpResponse({ status: 200 })));
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should skip adding token for /api/config/jwt request', () => {
    authService.getJwtEnabledStatus.and.returnValue(of(true));
    authService.getToken.and.returnValue(mockToken);

    interceptor.intercept(mockConfigRequest, mockHandler).subscribe((event: HttpEvent<any>) => {
      expect(mockHandler.handle).toHaveBeenCalledWith(mockConfigRequest);
      expect(mockHandler.handle.calls.mostRecent().args[0].headers.get('Authorization')).toBeNull();
    });
  });

  it('should not add token if jwtEnabled is false', () => {
    authService.getJwtEnabledStatus.and.returnValue(of(false));
    authService.getToken.and.returnValue(mockToken);

    interceptor.intercept(mockRequest, mockHandler).subscribe((event: HttpEvent<any>) => {
      expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
      expect(mockHandler.handle.calls.mostRecent().args[0].headers.get('Authorization')).toBeNull();
    });
  });

  it('should not add token if no token is available', () => {
    authService.getJwtEnabledStatus.and.returnValue(of(true));
    authService.getToken.and.returnValue(null);

    interceptor.intercept(mockRequest, mockHandler).subscribe((event: HttpEvent<any>) => {
      expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
      expect(mockHandler.handle.calls.mostRecent().args[0].headers.get('Authorization')).toBeNull();
    });
  });

  it('should add Authorization header with token if jwtEnabled is true and token exists', () => {
    authService.getJwtEnabledStatus.and.returnValue(of(true));
    authService.getToken.and.returnValue(mockToken);

    interceptor.intercept(mockRequest, mockHandler).subscribe((event: HttpEvent<any>) => {
      const handledRequest = mockHandler.handle.calls.mostRecent().args[0];
      expect(mockHandler.handle).toHaveBeenCalled();
      expect(handledRequest.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    });
  });

  it('should pass the modified request to the next handler', () => {
    authService.getJwtEnabledStatus.and.returnValue(of(true));
    authService.getToken.and.returnValue(mockToken);

    interceptor.intercept(mockRequest, mockHandler).subscribe();

    expect(mockHandler.handle).toHaveBeenCalledTimes(1);
    const modifiedRequest = mockHandler.handle.calls.mostRecent().args[0];
    expect(modifiedRequest instanceof HttpRequest).toBeTrue();
    expect(modifiedRequest.url).toBe(mockRequest.url);
  });
});

describe('jwtInterceptorFn', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let mockNext: jasmine.Spy<(req: HttpRequest<any>) => Observable<HttpEvent<any>>>;

  const mockToken = 'mock-jwt-token';
  const mockRequest = new HttpRequest('GET', '/api/test');

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getToken', 'getJwtEnabledStatus']);
    mockNext = jasmine.createSpy('next');
    mockNext.and.returnValue(of(new HttpResponse({ status: 200 })));

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    authService.getJwtEnabledStatus.and.returnValue(of(true));
    authService.getToken.and.returnValue(mockToken);
  });

  it('should call JwtInterceptor.intercept with injected AuthService', () => {
    const result = TestBed.runInInjectionContext(() => jwtInterceptorFn(mockRequest, mockNext));
    result.subscribe((event: HttpEvent<any>) => {
      expect(mockNext).toHaveBeenCalled();
      const handledRequest = mockNext.calls.mostRecent().args[0];
      expect(handledRequest.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    });
  });
});
