import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientFormComponent } from './client-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import {provideRouter, Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {GenericService} from '../../../../../core/services/generic-service/generic.service';
import {Client} from '../../../../../core/models/client.model';
import {User} from '../../../../../core/models/user.model';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

describe('ClientFormComponent', () => {
  let component: ClientFormComponent;
  let fixture: ComponentFixture<ClientFormComponent>;
  let clientService: jasmine.SpyObj<GenericService<Client>>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
  const mockClient: Client = { id: 1, surnom: 'client1',  idUser: 1, userName: 'user1', user: mockUser };

  beforeEach(async () => {
    const clientServiceSpy = jasmine.createSpyObj<GenericService<Client>>('GenericService', ['create', 'update']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        BrowserAnimationsModule,
        ClientFormComponent
      ],
      providers: [
        { provide: GenericService<Client>, useValue: clientServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: undefined } },
            data: of({ client: undefined })
          }
        }
      ]
    }).compileComponents();

    clientService = TestBed.inject(GenericService<Client>) as jasmine.SpyObj<GenericService<Client>>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
    router.navigate.and.returnValue(Promise.resolve(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.clientForm.valid).toBeFalsy();
  });

  it('should submit form and navigate in create mode', () => {
    clientService.create.and.returnValue(of(mockClient));
    component.clientForm.setValue({ surnom: 'client1',  user_id: 1 });

    component.onSubmit();

    expect(clientService.create).toHaveBeenCalledWith(
      `${component['baseUri']}/api/client`,
      jasmine.objectContaining({ surnom: 'client1',  user_id: 1 })
    );
    expect(clientService.update).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/client']);
  });

  it('should submit form and navigate in edit mode', async () => {
    TestBed.resetTestingModule();
    const clientServiceSpy = jasmine.createSpyObj<GenericService<Client>>('GenericService', ['create', 'update']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        BrowserAnimationsModule,
        ClientFormComponent
      ],
      providers: [
        provideRouter([]),
        { provide: GenericService<Client>, useValue: clientServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: 1 } }, // Mode édition
            data: of({ client: mockClient })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    clientService = TestBed.inject(GenericService<Client>) as jasmine.SpyObj<GenericService<Client>>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    router.navigate.and.returnValue(Promise.resolve(true));
    clientService.update.and.returnValue(of(mockClient));

    component.clientForm.setValue({ surnom: 'client1',  user_id: 1 });
    component.onSubmit();

    expect(clientService.update).toHaveBeenCalledWith(
      `${component['baseUri']}/api/client`,
      1,
      jasmine.objectContaining({ surnom: 'client1',  user_id: 1 })
    );
    expect(clientService.create).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/client']);
  });
});
