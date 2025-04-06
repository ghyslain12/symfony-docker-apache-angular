import {MaterialComponent} from './material.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Material} from '../../../../core/models/material.model';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';


describe('MaterialComponent', () => {
  let component: MaterialComponent;
  let fixture: ComponentFixture<MaterialComponent>;

  const mockMaterials: Material[] = [
    { id: 1, designation: 'modem2', checked: false },
    { id: 2, designation: 'stb2', checked: false }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { data: of({ materials: mockMaterials }) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with materials from resolver', () => {
    expect(component.materials.length).toBe(2);
    expect(component.materials).toEqual(mockMaterials);
  });

  it('should display material in table', () => {
    component.materials = [
      { id: 1, designation: 'modem2', checked: false },
      { id: 2, designation: 'stb2', checked: false }
    ];
    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(2);
    expect(tableRows[0].textContent).toContain(' 1  modem2 VoirModifierSupprimer');
  });
});
