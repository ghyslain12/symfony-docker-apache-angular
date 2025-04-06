import {GenericService} from './generic.service';
import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Material} from '../../models/material.model';

describe('Material CRUD Operations', () => {
  let service: GenericService<Material>;
  let httpMock: HttpTestingController;
  let baseUri = environment.baseUri;
  const mockMaterial: Material = { id: 1, designation: 'modem', checked: false };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        GenericService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(GenericService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes HTTP en attente
  });

  it('should create a material', () => {
    service.create(`${baseUri}/api/utilisateur`, mockMaterial).subscribe(material => {
      expect(material).toEqual(mockMaterial);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur`);
    expect(req.request.method).toBe('POST');
    req.flush(mockMaterial);
  });

  it('should get a material by id', () => {
    service.getById(`${baseUri}/api/utilisateur`, 1).subscribe(material => {
      expect(material).toEqual(mockMaterial);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMaterial);
  });

  it('should handle error when getting material fails', () => {
    service.getById(`${baseUri}/api/utilisateur`, 1).subscribe({
      error: (error) => {
        expect(error.message).toBe('Not found');
      }
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should get all materials', () => {
    service.getAll(`${baseUri}/api/utilisateur`).subscribe(materials => {
      expect(materials.length).toBe(1);
      expect(materials[0]).toEqual(mockMaterial);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur`);
    expect(req.request.method).toBe('GET');
    req.flush([mockMaterial]);
  });

  it('should update a material', () => {
    service.update(`${baseUri}/api/utilisateur`, 1, mockMaterial).subscribe(material => {
      expect(material).toEqual(mockMaterial);
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockMaterial);
  });

  it('should delete a material', () => {
    service.delete(`${baseUri}/api/utilisateur`, 1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUri}/api/utilisateur/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
