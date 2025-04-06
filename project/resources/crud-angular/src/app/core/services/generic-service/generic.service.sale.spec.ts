import {GenericService} from './generic.service';
import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Sale} from '../../models/sale.model';
import {Client} from '../../models/client.model';
import {Material} from '../../models/material.model';
import {User} from '../../models/user.model';

describe('Sale CRUD Operations', () => {
  let service: GenericService<Sale>;
  let httpMock: HttpTestingController;
  let baseUri = environment.baseUri;
  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
  const mockClient: Client = { id: 1, surnom: 'client1',  idUser: 1, userName: 'user1', user: mockUser };
  const mockMaterial: Material = { id: 1, designation: 'modem', checked: false };
  const mockSale: Sale = { id: 1, titre: 'sale1', description: 'desc1', idClient: 1, materials: [mockMaterial], customer: mockClient };

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

  it('should create a sale', () => {
    service.create(`${baseUri}/api/utilisateur`, mockSale).subscribe(sale => {
      expect(sale).toEqual(mockSale);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur`);
    expect(req.request.method).toBe('POST');
    req.flush(mockSale);
  });

  it('should get a sale by id', () => {
    service.getById(`${baseUri}/api/utilisateur`, 1).subscribe(sale => {
      expect(sale).toEqual(mockSale);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSale);
  });

  it('should handle error when getting sale fails', () => {
    service.getById(`${baseUri}/api/utilisateur`, 1).subscribe({
      error: (error) => {
        expect(error.message).toBe('Not found');
      }
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should get all sales', () => {
    service.getAll(`${baseUri}/api/utilisateur`).subscribe(sales => {
      expect(sales.length).toBe(1);
      expect(sales[0]).toEqual(mockSale);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur`);
    expect(req.request.method).toBe('GET');
    req.flush([mockSale]);
  });

  it('should update a sale', () => {
    service.update(`${baseUri}/api/utilisateur`, 1, mockSale).subscribe(sale => {
      expect(sale).toEqual(mockSale);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockSale);
  });

  it('should delete a sale', () => {
    service.delete(`${baseUri}/api/utilisateur`, 1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
