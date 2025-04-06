import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GenericService } from '../../../../../core/services/generic-service/generic.service';
import { Ticket } from '../../../../../core/models/ticket.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Sale } from '../../../../../core/models/sale.model';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-ticket-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    MatButtonModule,
    MatLabel,
    MatInput,
    MatFormFieldModule,
    MatSelectModule,
    CdkTextareaAutosize,
    TextFieldModule,
    MatCardModule
  ],
  templateUrl: './ticket-form.component.html'
})
export class TicketFormComponent implements OnInit{
  ticketForm: FormGroup;
  isEditMode = false;
  ticketId?: number;
  titrePage = "Ajouter";
  sales: Sale[] = [];
  private baseUri = environment.baseUri;

  constructor(
    private fb: FormBuilder,
    private genericService: GenericService<Ticket>,
    private genericServiceSale: GenericService<Sale>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ticketForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      sale_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.ticketId = this.route.snapshot.params['id'];
    if (this.ticketId) {
      this.titrePage = "Modifier";
      this.isEditMode = true;
      this.loadTickets();
    } else {
        this.loadSales();
    }
  }

  loadTickets() {
    this.route.data.subscribe((response: any) => {
      this.sales = response.sales

      this.ticketForm.patchValue({
        id: response.ticket.id,
        titre: response.ticket.titre,
        description: response.ticket.description,
        sale_id: response.ticket.sales[0].id,
      });
    });
  }

  loadSales() {
    this.route.data.subscribe((response: any) => {
      this.sales = response.sales;
    });
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      const ticketData = this.ticketForm.value;
      const request = this.isEditMode && this.ticketId
        ? this.genericService.update(`${this.baseUri}/api/ticket`, this.ticketId, ticketData)
        : this.genericService.create(`${this.baseUri}/api/ticket`, ticketData);

      request.subscribe(() => {
        this.router.navigate(['/ticket']).then();
      });
    }
  }

  goBack() {
    this.router.navigate(['/ticket']).then();
  }
}
