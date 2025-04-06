import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleFormComponent } from './sale-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import {provideRouter, Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {GenericService} from '../../../../../core/services/generic-service/generic.service';
import {Sale} from '../../../../../core/models/sale.model';
import {User} from '../../../../../core/models/user.model';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {Client} from '../../../../../core/models/client.model';
import {Material} from '../../../../../core/models/material.model';

describe('SaleFormComponent', () => {
  let component: SaleFormComponent;
  let fixture: ComponentFixture<SaleFormComponent>;
  let saleService: jasmine.SpyObj<GenericService<Sale>>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
  const mockClient: Client = { id: 1, surnom: 'client1',  idUser: 1, userName: 'user1', user: mockUser };
  const mockMaterial: Material = { id: 1, designation: 'modem', checked: false };
  const mockSale: Sale = { id: 1, titre: 'sale1', description: 'desc1', idClient: 1, materials: [mockMaterial], customer: mockClient };

  beforeEach(async () => {
    const saleServiceSpy = jasmine.createSpyObj<GenericService<Sale>>('GenericService', ['create', 'update']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        BrowserAnimationsModule,
        SaleFormComponent
      ],
      providers: [
        { provide: GenericService<Sale>, useValue: saleServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: undefined } },
            data: of({ sale: undefined })
          }
        }
      ]
    }).compileComponents();

    saleService = TestBed.inject(GenericService<Sale>) as jasmine.SpyObj<GenericService<Sale>>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
    router.navigate.and.returnValue(Promise.resolve(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.saleForm.valid).toBeFalsy();
  });

  it('should submit form and navigate in create mode', () => {
    saleService.create.and.returnValue(of(mockSale));
    component.saleForm.setValue({ titre: 'sale1', description: 'desc1', customer_id: 1 });

    component.onSubmit();

    expect(saleService.create).toHaveBeenCalledWith(
      `${component['baseUri']}/api/sale`,
      jasmine.objectContaining({ titre: 'sale1', description: 'desc1', customer_id: 1 })
    );
    expect(saleService.update).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/sale']);
  });

  it('should submit form and navigate in edit mode', async () => {
    TestBed.resetTestingModule();
    const saleServiceSpy = jasmine.createSpyObj<GenericService<Sale>>('GenericService', ['create', 'update']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        BrowserAnimationsModule,
        SaleFormComponent
      ],
      providers: [
        provideRouter([]),
        { provide: GenericService<Sale>, useValue: saleServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: 1 } }, // Mode édition
            data: of({ sale: mockSale })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SaleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    saleService = TestBed.inject(GenericService<Sale>) as jasmine.SpyObj<GenericService<Sale>>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    router.navigate.and.returnValue(Promise.resolve(true));
    saleService.update.and.returnValue(of(mockSale));

    component.saleForm.setValue({ titre: 'sale1', description: 'desc1', customer_id: 1 });
    component.onSubmit();

    expect(saleService.update).toHaveBeenCalledWith(
      `${component['baseUri']}/api/sale`,
      1,
      jasmine.objectContaining({ titre: 'sale1', description: 'desc1', customer_id: 1 })
    );
    expect(saleService.create).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/sale']);
  });
});
