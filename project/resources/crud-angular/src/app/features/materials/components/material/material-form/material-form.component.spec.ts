import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialFormComponent } from './material-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import {provideRouter, Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {GenericService} from '../../../../../core/services/generic-service/generic.service';
import {Material} from '../../../../../core/models/material.model';

describe('MaterialFormComponent', () => {
  let component: MaterialFormComponent;
  let fixture: ComponentFixture<MaterialFormComponent>;
  let materialService: jasmine.SpyObj<GenericService<Material>>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  const mockMaterial: Material = { id: 1, designation: 'modem', checked: false };

  beforeEach(async () => {
    const materialServiceSpy = jasmine.createSpyObj<GenericService<Material>>('GenericService', ['create', 'update']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        BrowserAnimationsModule,
        MaterialFormComponent
      ],
      providers: [
        { provide: GenericService<Material>, useValue: materialServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: undefined } },
            data: of({ material: undefined })
          }
        }
      ]
    }).compileComponents();

    materialService = TestBed.inject(GenericService<Material>) as jasmine.SpyObj<GenericService<Material>>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
    router.navigate.and.returnValue(Promise.resolve(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.materialForm.valid).toBeFalsy();
  });

  it('should submit form and navigate in create mode', () => {
    materialService.create.and.returnValue(of(mockMaterial));
    component.materialForm.setValue({ designation: 'modem' });

    component.onSubmit();

    expect(materialService.create).toHaveBeenCalledWith(
      `${component['baseUri']}/api/material`,
      jasmine.objectContaining({ designation: 'modem' })
    );
    expect(materialService.update).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/material']);
  });

  it('should submit form and navigate in edit mode', async () => {
    TestBed.resetTestingModule();
    const materialServiceSpy = jasmine.createSpyObj<GenericService<Material>>('GenericService', ['create', 'update']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        BrowserAnimationsModule,
        MaterialFormComponent
      ],
      providers: [
        provideRouter([]),
        { provide: GenericService<Material>, useValue: materialServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: 1 } }, // Mode édition
            data: of({ material: mockMaterial })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    materialService = TestBed.inject(GenericService<Material>) as jasmine.SpyObj<GenericService<Material>>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    router.navigate.and.returnValue(Promise.resolve(true));
    materialService.update.and.returnValue(of(mockMaterial));

    component.materialForm.setValue({ designation: 'updated modem' });
    component.onSubmit();

    expect(materialService.update).toHaveBeenCalledWith(
      `${component['baseUri']}/api/material`,
      1,
      jasmine.objectContaining({ designation: 'updated modem' })
    );
    expect(materialService.create).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/material']);
  });
});
