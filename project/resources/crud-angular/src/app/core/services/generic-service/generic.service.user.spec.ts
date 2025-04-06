import {GenericService} from './generic.service';
import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {User} from '../../models/user.model';

describe('User CRUD Operations', () => {
  let service: GenericService<User>;
  let httpMock: HttpTestingController;
  let baseUri = environment.baseUri;
  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        GenericService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(GenericService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a user', () => {
    service.create(`${baseUri}/api/utilisateur`, mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should get a user by id', () => {
    service.getById(`${baseUri}/api/utilisateur`, 1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should handle error when getting user fails', () => {
    service.getById(`${baseUri}/api/utilisateur`, 1).subscribe({
      error: (error) => {
        expect(error.message).toBe('Not found');
      }
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should get all users', () => {
    service.getAll(`${baseUri}/api/utilisateur`).subscribe(users => {
      expect(users.length).toBe(1);
      expect(users[0]).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur`);
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
  });

  it('should update a user', () => {
    service.update(`${baseUri}/api/utilisateur`, 1, mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockUser);
  });

  it('should delete a user', () => {
    service.delete(`${baseUri}/api/utilisateur`, 1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
