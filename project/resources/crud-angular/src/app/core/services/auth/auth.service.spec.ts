import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  const baseUri = environment.baseUri;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    localStorage.clear();
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    router.navigate.and.returnValue(Promise.resolve(true));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('should initialize loggedIn as false when no token exists', fakeAsync(() => {
    const service = TestBed.inject(AuthService);
    let loggedInStatus: boolean;
    service.getLoggedInStatus().subscribe(status => loggedInStatus = status);
    tick();
    expect(loggedInStatus!).toBe(false);
  }));

  it('should initialize loggedIn as true when token exists', () => {
    localStorage.setItem('token', 'fake-token');
    const service = TestBed.inject(AuthService);
    expect(service.getLoggedInValue()).toBe(true);
  });

  it('should call config endpoint', fakeAsync(() => {
    const service = TestBed.inject(AuthService);
    const mockConfig = { jwt_enabled: true };
    let result: any;

    service.callConfig().subscribe(config => result = config);

    const req = httpMock.expectOne(`${baseUri}/api/config/jwt`);
    expect(req.request.method).toBe('GET');
    req.flush(mockConfig);

    tick();
    expect(result).toEqual(mockConfig);
  }));

  it('should login and set token', fakeAsync(() => {
    const service = TestBed.inject(AuthService);
    const credentials = { email: 'test@example.com', password: 'password' };
    const mockResponse = { token: 'jwt-token-123' };
    let loggedInStatus: boolean;

    service.login(credentials).subscribe(() => {
      service.getLoggedInStatus().subscribe(status => loggedInStatus = status);
    });

    const req = httpMock.expectOne(`${baseUri}/api/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);

    tick();
    expect(localStorage.getItem('token')).toBe('jwt-token-123');
    expect(loggedInStatus!).toBe(true);
  }));

  it('should return token from localStorage', () => {
    const service = TestBed.inject(AuthService);
    localStorage.setItem('token', 'test-token');
    expect(service.getToken()).toBe('test-token');

    localStorage.removeItem('token');
    expect(service.getToken()).toBeNull();
  });

  it('should return authentication status', () => {
    const service = TestBed.inject(AuthService);
    expect(service.isAuthenticated()).toBe(false);

    localStorage.setItem('token', 'test-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should logout and clear token', fakeAsync(() => {
    localStorage.setItem('token', 'test-token');
    const service = TestBed.inject(AuthService);

    let loggedInStatus: boolean;
    service.getLoggedInStatus().subscribe(status => loggedInStatus = status);
    tick();
    expect(loggedInStatus!).toBe(true);

    service.logout();
    tick();

    service.getLoggedInStatus().subscribe(status => loggedInStatus = status);
    tick();
    expect(localStorage.getItem('token')).toBeNull();
    expect(loggedInStatus!).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should emit jwtEnabled status', fakeAsync(() => {
    const service = TestBed.inject(AuthService);
    let jwtStatus: boolean;
    service.getJwtEnabledStatus().subscribe(status => jwtStatus = status);
    tick();
    expect(jwtStatus!).toBe(true);

    (service as any).jwtEnabled.next(false);
    tick();
    service.getJwtEnabledStatus().subscribe(status => jwtStatus = status);
    tick();
    expect(jwtStatus!).toBe(false);
  }));
});
