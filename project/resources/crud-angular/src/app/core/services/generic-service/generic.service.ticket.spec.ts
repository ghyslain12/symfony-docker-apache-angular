import {GenericService} from './generic.service';
import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Ticket} from '../../models/ticket.model';
import {Sale} from '../../models/sale.model';
import {Material} from '../../models/material.model';
import {Client} from '../../models/client.model';
import {User} from '../../models/user.model';

describe('Ticket CRUD Operations', () => {
  let service: GenericService<Ticket>;
  let httpMock: HttpTestingController;
  let baseUri = environment.baseUri;
  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
  const mockClient: Client = { id: 1, surnom: 'client1',  idUser: 1, userName: 'user1', user: mockUser };
  const mockMaterial: Material = { id: 1, designation: 'modem', checked: false };
  const mockSale: Sale = { id: 1, titre: 'sale1', description: 'desc1', idClient: 1, materials: [mockMaterial], customer: mockClient };
  const mockTicket: Ticket = { id: 1, titre: 'ticket1', description: 'ticketdesc1', idSale: 1, sales: [mockSale] };

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

  it('should create a ticket', () => {
    service.create(`${baseUri}/api/utilisateur`, mockTicket).subscribe(ticket => {
      expect(ticket).toEqual(mockTicket);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur`);
    expect(req.request.method).toBe('POST');
    req.flush(mockTicket);
  });

  it('should get a ticket by id', () => {
    service.getById(`${baseUri}/api/utilisateur`, 1).subscribe(ticket => {
      expect(ticket).toEqual(mockTicket);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTicket);
  });

  it('should handle error when getting ticket fails', () => {
    service.getById(`${baseUri}/api/utilisateur`, 1).subscribe({
      error: (error) => {
        expect(error.message).toBe('Not found');
      }
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should get all tickets', () => {
    service.getAll(`${baseUri}/api/utilisateur`).subscribe(tickets => {
      expect(tickets.length).toBe(1);
      expect(tickets[0]).toEqual(mockTicket);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur`);
    expect(req.request.method).toBe('GET');
    req.flush([mockTicket]);
  });

  it('should update a ticket', () => {
    service.update(`${baseUri}/api/utilisateur`, 1, mockTicket).subscribe(ticket => {
      expect(ticket).toEqual(mockTicket);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockTicket);
  });

  it('should delete a ticket', () => {
    service.delete(`${baseUri}/api/utilisateur`, 1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
