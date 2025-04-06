import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GenericService } from '../../../../../core/services/generic-service/generic.service';
import { Client } from '../../../../../core/models/client.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { User } from '../../../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-client-form',
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
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent implements OnInit{
  clientForm: FormGroup;
  isEditMode = false;
  clientId?: number;
  titrePage = "Ajouter";
  users: User[] = [];
  private baseUri = environment.baseUri;

  constructor(
    private fb: FormBuilder,
    private genericService: GenericService<Client>,
    private genericServiceUser: GenericService<User>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientForm = this.fb.group({
      surnom: ['', Validators.required],
      user_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.clientId = this.route.snapshot.params['id'];
    if (this.clientId) {
      this.titrePage = "Modifier";
      this.isEditMode = true;
      this.loadClients();
    } else {
      this.loadUsers();
    }
  }

  loadClients() {
    this.route.data.subscribe((response: any) => {
      this.users = response.users;
      this.clientForm.patchValue(response.client);
    });
  }

  loadUsers() {
    this.route.data.subscribe((response: any) => {
      this.users = response.users;
    });
  }
  onSubmit() {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      const request = this.isEditMode && this.clientId
        ? this.genericService.update(`${this.baseUri}/api/client`, this.clientId, clientData)
        : this.genericService.create(`${this.baseUri}/api/client`, clientData);

      request.subscribe(() => {
        this.router.navigate(['/client']).then();
      });
    }
  }

  goBack() {
    this.router.navigate(['/client']).then();
  }
}
