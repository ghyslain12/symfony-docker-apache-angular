import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Client } from '../../models/client.model';
import { User } from '../../models/user.model';
import { GenericService } from './generic.service';

describe('Client CRUD Operations', () => {
  let service: GenericService<Client>;
  let httpMock: HttpTestingController;
  const baseUri = environment.baseUri;
  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
  const mockClient: Client = { id: 1, surnom: 'client1', idUser: 1, userName: 'user1', user: mockUser };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GenericService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(GenericService<Client>);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    const requests = httpMock.match((req) => true);
    if (requests.length > 0) {
      fail(`Requêtes HTTP inattendues détectées : ${requests.map(req => req.request.url).join(', ')}`);
    }
  });

  it('should create a client', fakeAsync(() => {
    let result: Client | undefined;
    service.create(`${baseUri}/api/utilisateur`, mockClient).subscribe(client => {
      result = client;
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur`);
    expect(req.request.method).toBe('POST');
    req.flush(mockClient);

    tick();
    expect(result).toEqual(mockClient);
  }));

  it('should get a client by id', fakeAsync(() => {
    let result: Client | undefined;
    service.getById(`${baseUri}/api/utilisateur`, 1).subscribe(client => {
      result = client;
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockClient);

    tick();
    expect(result).toEqual(mockClient);
  }));

  it('should handle error when getting client fails', fakeAsync(() => {
    let errorMessage: string | undefined;
    service.getById(`${baseUri}/api/utilisateur`, 1).subscribe({
      error: (error) => {
        errorMessage = error.message;
      }
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });

    tick();
    expect(errorMessage).toBe('Not found');
  }));

  it('should get all clients', fakeAsync(() => {
    let result: Client[] | undefined;
    service.getAll(`${baseUri}/api/utilisateur`).subscribe(clients => {
      result = clients;
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur`);
    expect(req.request.method).toBe('GET');
    req.flush([mockClient]);

    tick();
    expect(result?.length).toBe(1);
    expect(result?.[0]).toEqual(mockClient);
  }));

  it('should update a client', fakeAsync(() => {
    let result: Client | undefined;
    service.update(`${baseUri}/api/utilisateur`, 1, mockClient).subscribe(client => {
      result = client;
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockClient);

    tick();
    expect(result).toEqual(mockClient);
  }));

  it('should delete a client', fakeAsync(() => {
    let result: void | undefined;
    service.delete(`${baseUri}/api/utilisateur`, 1).subscribe(response => {
      result = response;
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    tick();
    expect(result).toBeNull();
  }));
});
