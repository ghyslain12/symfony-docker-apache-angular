import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaleShowComponent } from './sale-show.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import {Sale} from '../../../../../core/models/sale.model';
import {Material} from '../../../../../core/models/material.model';
import {Client} from '../../../../../core/models/client.model';
import {User} from '../../../../../core/models/user.model';

describe('SaleShowComponent', () => {
  let component: SaleShowComponent;
  let fixture: ComponentFixture<SaleShowComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
  const mockClient: Client = { id: 1, surnom: 'client1',  idUser: 1, userName: 'user1', user: mockUser };
  const mockMaterial: Material = { id: 1, designation: 'modem', checked: false };
  const mockSale: Sale = { id: 1, titre: 'sale1', description: 'desc1', idClient: 1, materials: [mockMaterial], customer: mockClient };

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        SaleShowComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ sale: mockSale }) // Mock des données du resolver
          }
        },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Déclenche ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize sale from resolver', () => {
    expect(component.sale).toEqual(mockSale);
  });

  it('should display sale designation in template', () => {
    const designationElement = fixture.nativeElement.querySelector('p');
    expect(designationElement.textContent).toContain('Titre  sale1');
  });

  it('should navigate back to sale list', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sale']);
  });
});
