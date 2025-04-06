import { Component, OnInit, ViewChild } from '@angular/core';
import { Ticket } from '../../../../core/models/ticket.model';
import { GenericService } from '../../../../core/services/generic-service/generic.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button';
import { Sale } from '../../../../core/models/sale.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-ticket',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit {
  tickets: Ticket[] = [];
  displayedColumns: string[] = ['id', 'titre', 'description', 'sales', 'actions'];
  dataSource = new MatTableDataSource<Ticket>();
  private baseUri = environment.baseUri;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private genericService: GenericService<Ticket>,
    private genericServiceSale: GenericService<Sale>,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((response: any) => {
      this.tickets = response.tickets;
      this.dataSource.data = response.tickets;
    });
  }

  // gestion pagination & tri du tableau
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // gestion filtre du tableau
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  loadTickets() {
    this.genericService.getAll(`${this.baseUri}/api/ticket`).subscribe(tickets => {
      this.tickets = tickets;
    });
  }

  viewTicket(ticket: Ticket) {
    this.router.navigate(['/ticket/show', ticket.id]).then();
  }

  editTicket(ticket: Ticket) {
    this.router.navigate(['/ticket/edit', ticket.id]).then();
  }

  deleteTicket(ticket: Ticket) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Voulez-vous vraiment supprimer ce ticket ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.genericService.delete(`${this.baseUri}/api/ticket`, ticket.id).subscribe(() => {
          this.loadTickets();
          const updatedData = this.dataSource.data.filter(item => item.id !== ticket.id);
          this.dataSource.data = updatedData;
          this.table.renderRows();
        });
      }
    });
  }

  goToAddSale() {
    this.router.navigate(['/ticket/add']).then();
  }
}
