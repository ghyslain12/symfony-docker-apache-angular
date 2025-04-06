import {TicketComponent} from './ticket.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Ticket} from '../../../../core/models/ticket.model';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {User} from '../../../../core/models/user.model';
import {Client} from '../../../../core/models/client.model';
import {Material} from '../../../../core/models/material.model';
import {Sale} from '../../../../core/models/sale.model';


describe('TicketComponent', () => {
  let component: TicketComponent;
  let fixture: ComponentFixture<TicketComponent>;

  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
  const mockClient: Client = { id: 1, surnom: 'client1',  idUser: 1, userName: 'user1', user: mockUser };
  const mockMaterial: Material = { id: 1, designation: 'modem', checked: false };
  const mockSale: Sale = { id: 1, titre: 'sale1', description: 'desc1', idClient: 1, materials: [mockMaterial], customer: mockClient };

  const mockTickets: Ticket[] = [
    { id: 1, titre: 'ticket1', description: 'ticketdesc1', idSale: 1, sales: [mockSale] },
    { id: 2, titre: 'ticket1', description: 'ticketdesc1', idSale: 1, sales: [mockSale] }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { data: of({ tickets: mockTickets }) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with tickets from resolver', () => {
    expect(component.tickets.length).toBe(2);
    expect(component.tickets).toEqual(mockTickets);
  });

  it('should display ticket in table', () => {
    const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
    const mockClient: Client = { id: 1, surnom: 'client1',  idUser: 1, userName: 'user1', user: mockUser };
    const mockMaterial: Material = { id: 1, designation: 'modem', checked: false };
    const mockSale: Sale = { id: 1, titre: 'sale1', description: 'desc1', idClient: 1, materials: [mockMaterial], customer: mockClient };

    component.tickets = [
      { id: 1, titre: 'ticket1', description: 'ticketdesc1', idSale: 1, sales: [mockSale] },
      { id: 2, titre: 'ticket1', description: 'ticketdesc1', idSale: 1, sales: [mockSale] }
    ];
    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(2);
    expect(tableRows[0].textContent).toContain(' 1 ticket1ticketdesc1sale1VoirModifierSupprimer');
  });
});
