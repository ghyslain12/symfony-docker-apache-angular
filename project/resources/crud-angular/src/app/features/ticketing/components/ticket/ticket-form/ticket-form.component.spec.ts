import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketFormComponent } from './ticket-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import {provideRouter, Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {GenericService} from '../../../../../core/services/generic-service/generic.service';
import {Ticket} from '../../../../../core/models/ticket.model';
import {User} from '../../../../../core/models/user.model';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {Sale} from '../../../../../core/models/sale.model';
import {Material} from '../../../../../core/models/material.model';
import {Client} from '../../../../../core/models/client.model';

describe('TicketFormComponent', () => {
  let component: TicketFormComponent;
  let fixture: ComponentFixture<TicketFormComponent>;
  let ticketService: jasmine.SpyObj<GenericService<Ticket>>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
  const mockClient: Client = { id: 1, surnom: 'client1',  idUser: 1, userName: 'user1', user: mockUser };
  const mockMaterial: Material = { id: 1, designation: 'modem', checked: false };
  const mockSale: Sale = { id: 1, titre: 'sale1', description: 'desc1', idClient: 1, materials: [mockMaterial], customer: mockClient };
  const mockTicket: Ticket = { id: 1, titre: 'ticket1', description: 'ticketdesc1', idSale: 1, sales: [mockSale] };

  beforeEach(async () => {
    const ticketServiceSpy = jasmine.createSpyObj<GenericService<Ticket>>('GenericService', ['create', 'update']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        BrowserAnimationsModule,
        TicketFormComponent
      ],
      providers: [
        { provide: GenericService<Ticket>, useValue: ticketServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: undefined } },
            data: of({ ticket: undefined })
          }
        }
      ]
    }).compileComponents();

    ticketService = TestBed.inject(GenericService<Ticket>) as jasmine.SpyObj<GenericService<Ticket>>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
    router.navigate.and.returnValue(Promise.resolve(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.ticketForm.valid).toBeFalsy();
  });

  it('should submit form and navigate in create mode', () => {
    ticketService.create.and.returnValue(of(mockTicket));
    component.ticketForm.setValue({ titre: 'ticket1', description: 'ticketdesc1', sale_id: 1 });

    component.onSubmit();

    expect(ticketService.create).toHaveBeenCalledWith(
      `${component['baseUri']}/api/ticket`,
      jasmine.objectContaining({ titre: 'ticket1', description: 'ticketdesc1', sale_id: 1 })
    );
    expect(ticketService.update).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/ticket']);
  });

  it('should submit form and navigate in edit mode', async () => {
    TestBed.resetTestingModule();
    const ticketServiceSpy = jasmine.createSpyObj<GenericService<Ticket>>('GenericService', ['create', 'update']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        BrowserAnimationsModule,
        TicketFormComponent
      ],
      providers: [
        provideRouter([]),
        { provide: GenericService<Ticket>, useValue: ticketServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: 1 } }, // Mode édition
            data: of({ ticket: mockTicket })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    ticketService = TestBed.inject(GenericService<Ticket>) as jasmine.SpyObj<GenericService<Ticket>>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    router.navigate.and.returnValue(Promise.resolve(true));
    ticketService.update.and.returnValue(of(mockTicket));

    component.ticketForm.setValue({ titre: 'ticket1', description: 'ticketdesc1', sale_id: 1 });
    component.onSubmit();

    expect(ticketService.update).toHaveBeenCalledWith(
      `${component['baseUri']}/api/ticket`,
      1,
      jasmine.objectContaining({ titre: 'ticket1', description: 'ticketdesc1', sale_id: 1 })
    );
    expect(ticketService.create).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/ticket']);
  });
});
