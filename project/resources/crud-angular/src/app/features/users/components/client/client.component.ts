import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../../../core/models/client.model';
import { GenericService } from '../../../../core/services/generic-service/generic.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../../core/models/user.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-client',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit {
  clients: Client[] = [];
  users: User[] = [];
  displayedColumns: string[] = ['id', 'surnom', 'users', 'actions'];
  dataSource = new MatTableDataSource<Client>();
  private baseUri = environment.baseUri;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private genericService: GenericService<Client>,
    private genericServiceUser: GenericService<User>,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

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

  ngOnInit() {
    this.activatedRoute.data.subscribe((response: any) => {
      this.users = response.users;
      this.clients = response.clients;
      this.dataSource.data = response.clients;
    });
  }

  loadClients() {
    this.genericService.getAll(`${this.baseUri}/api/client`).subscribe(clients => {
      this.clients = clients;
    });
  }

  viewClient(client: Client) {
    this.router.navigate(['/client/show', client.id]).then();
  }

  editClient(client: Client) {
    this.router.navigate(['/client/edit', client.id]).then();
  }

  deleteClient(client: Client) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Voulez-vous vraiment supprimer ce client ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.genericService.delete(`${this.baseUri}/api/client`, client.id).subscribe(() => {
          this.loadClients();
          const updatedData = this.dataSource.data.filter(item => item.id !== client.id);
          this.dataSource.data = updatedData;
          this.table.renderRows();
        });
      }
    });
  }

  goToAddUser() {
    this.router.navigate(['/client/add']).then();
  }
}
