import {UserComponent} from './user.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {User} from '../../../../core/models/user.model';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';


describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  const mockUsers: User[] = [
    { id: 1, name: 'user1', email: 'test@gmail.com' },
    { id: 2, name: 'user2', email: 'test2@gmail.com' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { data: of({ users: mockUsers }) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with users from resolver', () => {
    expect(component.users.length).toBe(2);
    expect(component.users).toEqual(mockUsers);
  });

  it('should display user in table', () => {
    component.users = [
      { id: 1, name: 'user1', email: 'test@gmail.com' },
      { id: 2, name: 'user2', email: 'test2@gmail.com' }
    ];
    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(2);
    expect(tableRows[0].textContent).toContain(' 1 user1test@gmail.comVoirModifierSupprimer');
  });
});
