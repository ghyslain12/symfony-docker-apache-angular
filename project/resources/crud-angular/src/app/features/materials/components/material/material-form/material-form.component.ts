import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GenericService } from '../../../../../core/services/generic-service/generic.service';
import { Material } from '../../../../../core/models/material.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-material-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    MatButtonModule,
    MatLabel,
    MatInput,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './material-form.component.html'
})
export class MaterialFormComponent implements OnInit{
  materialForm: FormGroup;
  isEditMode = false;
  materialId?: number;
  titrePage = "Ajouter";
  private baseUri = environment.baseUri;

  constructor(
    private fb: FormBuilder,
    private genericService: GenericService<Material>,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.materialForm = this.fb.group({
      designation: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.materialId = this.route.snapshot.params['id'];
    if (this.materialId) {
      this.titrePage = "Modifier";
      this.isEditMode = true;
      this.loadMaterials();
    }
  }

  loadMaterials() {
    this.route.data.subscribe((response: any) => {
      this.materialForm.patchValue(response.material);
    });
  }

  onSubmit() {
    if (this.materialForm.valid) {
      const materialData = this.materialForm.value;
      const request = this.isEditMode && this.materialId
        ? this.genericService.update(`${this.baseUri}/api/material`, this.materialId, materialData)
        : this.genericService.create(`${this.baseUri}/api/material`, materialData);

      request.subscribe(() => {
        this.router.navigate(['/material']).then();
      });
    }
  }

  goBack() {
    this.router.navigate(['/material']).then();
  }
}
