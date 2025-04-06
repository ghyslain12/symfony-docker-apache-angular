import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketShowComponent } from './ticket-show.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import {Ticket} from '../../../../../core/models/ticket.model';
import {User} from '../../../../../core/models/user.model';
import {Client} from '../../../../../core/models/client.model';
import {Material} from '../../../../../core/models/material.model';
import {Sale} from '../../../../../core/models/sale.model';

describe('TicketShowComponent', () => {
  let component: TicketShowComponent;
  let fixture: ComponentFixture<TicketShowComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
  const mockClient: Client = { id: 1, surnom: 'client1',  idUser: 1, userName: 'user1', user: mockUser };
  const mockMaterial: Material = { id: 1, designation: 'modem', checked: false };
  const mockSale: Sale = { id: 1, titre: 'sale1', description: 'desc1', idClient: 1, materials: [mockMaterial], customer: mockClient };
  const mockTicket: Ticket = { id: 1, titre: 'ticket1', description: 'ticketdesc1', idSale: 1, sales: [mockSale] };

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        TicketShowComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ ticket: mockTicket }) // Mock des données du resolver
          }
        },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Déclenche ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize ticket from resolver', () => {
    expect(component.ticket).toEqual(mockTicket);
  });

  it('should display ticket designation in template', () => {
    const designationElement = fixture.nativeElement.querySelector('p');
    expect(designationElement.textContent).toContain('Titre  ticket1');
  });

  it('should navigate back to ticket list', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/ticket']);
  });
});
