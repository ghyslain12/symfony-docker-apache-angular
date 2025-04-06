import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GenericService } from '../../../../../core/services/generic-service/generic.service';
import { User } from '../../../../../core/models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../../../environments/environment';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: jasmine.SpyObj<GenericService<User>>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;
  let authService: jasmine.SpyObj<AuthService>;
  let dialog: MatDialog;
  let httpTestingController: HttpTestingController;

  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj<GenericService<User>>('GenericService', ['create', 'update']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated', 'callConfig']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        UserFormComponent
      ],
      providers: [
        { provide: GenericService<User>, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: undefined } },
            data: of({ user: undefined })
          }
        }
      ]
    }).compileComponents();

    userService = TestBed.inject(GenericService<User>) as jasmine.SpyObj<GenericService<User>>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    dialog = TestBed.inject(MatDialog);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Mock de callConfig pour éviter les appels HTTP réels
    authService.callConfig.and.returnValue(of({ jwt_enabled: true }));
    router.navigate.and.returnValue(Promise.resolve(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.userForm.valid).toBeFalsy();
  });

  it('should initialize in create mode with correct title', () => {
    expect(component.isEditMode).toBeFalse();
    expect(component.titrePage).toBe('Ajouter');
    expect(component.userForm.get('password')?.validator).toBeNull();
  });

  it('should initialize in edit mode with correct title and no password validator', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        UserFormComponent
      ],
      providers: [
        { provide: GenericService<User>, useValue: userService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: 1 } },
            data: of({ user: mockUser })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isEditMode).toBeTrue();
    expect(component.titrePage).toBe('Modifier');
    expect(component.userForm.get('password')?.validator).toBeNull();
  });

  it('should load user data in edit mode', async () => {
    TestBed.resetTestingModule(); // Réinitialiser avant de reconfigurer
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        UserFormComponent
      ],
      providers: [
        { provide: GenericService<User>, useValue: userService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: 1 } },
            data: of({ user: mockUser })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.userForm.value).toEqual({
      name: 'user1',
      email: 'test@gmail.com',
      password: ''
    });
  });

  it('should submit form and navigate to /login in create mode', () => {
    userService.create.and.returnValue(of(mockUser));
    component.userForm.setValue({ name: 'user1', email: 'test@gmail.com', password: 'test' });

    component.onSubmit();

    expect(userService.create).toHaveBeenCalledWith(
      `${environment.baseUri}/api/utilisateur`,
      jasmine.objectContaining({ name: 'user1', email: 'test@gmail.com', password: 'test' })
    );
    expect(userService.update).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should submit form and navigate to /login in edit mode', () => {
    component.isEditMode = true;
    component.userId = 1;
    userService.update.and.returnValue(of(mockUser));
    component.userForm.setValue({ name: 'user1', email: 'test@gmail.com', password: 'test' });

    component.onSubmit();

    expect(userService.update).toHaveBeenCalledWith(
      `${environment.baseUri}/api/utilisateur`,
      1,
      jasmine.objectContaining({ name: 'user1', email: 'test@gmail.com', password: 'test' })
    );
    expect(userService.create).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error dialog on submit failure', () => {
    const errorMessage = 'Test error';
    userService.create.and.returnValue(throwError(() => new Error(errorMessage)));
    spyOn(component, 'showErrorDialog');
    component.userForm.setValue({ name: 'user1', email: 'test@gmail.com', password: 'test' });

    component.onSubmit();

    expect(component.showErrorDialog).toHaveBeenCalledWith(
      'Erreur lors de la création de l’utilisateur : ' + errorMessage
    );
  });

  it('should navigate to /user if authenticated on goBack', () => {
    authService.isAuthenticated.and.returnValue(true);

    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith(['/user']);
  });

  it('should navigate to /login if not authenticated on goBack', () => {
    authService.isAuthenticated.and.returnValue(false);

    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
