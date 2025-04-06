import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GenericService } from '../../../../../core/services/generic-service/generic.service';
import { Sale } from '../../../../../core/models/sale.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Client } from '../../../../../core/models/client.model';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Material } from '../../../../../core/models/material.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import {TextFieldModule} from '@angular/cdk/text-field';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-sale-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    MatButtonModule,
    MatLabel,
    MatInput,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    FormsModule,
    TextFieldModule,
  ],
  templateUrl: './sale-form.component.html'
})
export class SaleFormComponent implements OnInit{
  saleForm: FormGroup;
  isEditMode = false;
  saleId?: number;
  titrePage = "Ajouter";
  clients: Client[] = [];
  materials: Material[] = [];
  sale: Sale | undefined;
  private baseUri = environment.baseUri;

  constructor(
    private fb: FormBuilder,
    private genericService: GenericService<Sale>,
    private genericServiceClient: GenericService<Client>,
    private genericServiceMaterial: GenericService<Material>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.saleForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      customer_id: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.saleId = this.route.snapshot.params['id'];
    if (this.saleId) {
      this.titrePage = "Modifier";
      this.isEditMode = true;

      this.loadSales();
    } else {
        this.loadClients();
        this.loadMaterials();
    }
  }

  loadClients() {
    this.route.data.subscribe((response: any) => {
      this.clients = response.clients;
    });
  }

  loadMaterialsWithFormControl() {
    this.materials.forEach(material => { //ajouter formControle et checkbox checked
      this.saleForm.addControl(`material_${material.id}`, this.fb.control(false));
      if (this.sale !== undefined) {
        material.checked = (this.sale.materials.some(el => el.id === material.id));
      }
    });
  }

  loadMaterials() {
    this.route.data.subscribe((response: any) => {
      this.materials = response.materials;
      this.loadMaterialsWithFormControl();
    });
  }

  loadSales() {
    this.route.data.subscribe((response: any) => {
      this.sale = response.sale;
      this.materials = response.materials;
      this.clients = response.clients;

      this.saleForm.patchValue(response.sale);

      this.loadMaterialsWithFormControl();
    });
  }

  onSubmit() {
    if (this.saleForm.valid) {
      const saleData = this.saleForm.value;
      const request = this.isEditMode && this.saleId
        ? this.genericService.update(`${this.baseUri}/api/sale`, this.saleId, saleData)
        : this.genericService.create(`${this.baseUri}/api/sale`, saleData);

      request.subscribe(() => {
        this.router.navigate(['/sale']).then();
      });
    }
  }

  goBack() {
    this.router.navigate(['/sale']).then();
  }
}
