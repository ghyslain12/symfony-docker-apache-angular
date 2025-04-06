import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Client} from '../../../../core/models/client.model';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {User} from '../../../../core/models/user.model';
import {ClientComponent} from '../client/client.component';


describe('ClientComponent', () => {
  let component: ClientComponent;
  let fixture: ComponentFixture<ClientComponent>;

  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
  const mockUser2: User = { id: 2, name: 'user2', email: 'test2@gmail.com' };

  const mockClients: Client[] = [
    { id: 1, surnom: 'client1',  idUser: 1, userName: 'user1', user: mockUser },
    { id: 2, surnom: 'client2',  idUser: 2, userName: 'user2', user: mockUser2 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { data: of({ clients: mockClients }) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with clients from resolver', () => {
    expect(component.clients.length).toBe(2);
    expect(component.clients).toEqual(mockClients);
  });

  it('should display client in table', () => {
    const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
    const mockUser2: User = { id: 2, name: 'user2', email: 'test2@gmail.com' };

    component.clients = [
      { id: 1, surnom: 'client1',  idUser: 1, userName: 'user1', user: mockUser },
      { id: 2, surnom: 'client2',  idUser: 2, userName: 'user2', user: mockUser2 }
    ];
    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(2);
    expect(tableRows[0].textContent).toContain(' 1 client1user1VoirModifierSupprimer');
  });
});
