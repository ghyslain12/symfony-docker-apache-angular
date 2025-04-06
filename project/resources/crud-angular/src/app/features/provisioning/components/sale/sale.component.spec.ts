import {SaleComponent} from './sale.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Sale} from '../../../../core/models/sale.model';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {User} from '../../../../core/models/user.model';
import {Client} from '../../../../core/models/client.model';
import {Material} from '../../../../core/models/material.model';


describe('SaleComponent', () => {
  let component: SaleComponent;
  let fixture: ComponentFixture<SaleComponent>;

  const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
  const mockClient: Client = { id: 1, surnom: 'client1',  idUser: 1, userName: 'modem', user: mockUser };
  const mockMaterial: Material = { id: 1, designation: 'modem', checked: false };

  const mockSales: Sale[] = [
    { id: 1, titre: 'sale1', description: 'desc1', idClient: 1, materials: [mockMaterial], customer: mockClient },
    { id: 2, titre: 'sale2', description: 'desc2', idClient: 1, materials: [mockMaterial], customer: mockClient }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { data: of({ sales: mockSales }) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with sales from resolver', () => {
    expect(component.sales.length).toBe(2);
    expect(component.sales).toEqual(mockSales);
  });

  it('should display sale in table', () => {
    const mockUser: User = { id: 1, name: 'user1', email: 'test@gmail.com' };
    const mockClient: Client = { id: 1, surnom: 'client1',  idUser: 1, userName: 'modem', user: mockUser };
    const mockMaterial: Material = { id: 1, designation: 'modem', checked: false };

    component.sales = [
      { id: 1, titre: 'sale1', description: 'desc1', idClient: 1, materials: [mockMaterial], customer: mockClient },
      { id: 2, titre: 'sale2', description: 'desc2', idClient: 1, materials: [mockMaterial], customer: mockClient }
    ];
    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(2);
    expect(tableRows[0].textContent).toContain(' 1  sale1  desc1  modem VoirModifierSupprimer');
  });
});
