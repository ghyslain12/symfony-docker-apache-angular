import { Component, OnInit, ViewChild } from '@angular/core';
import { Sale } from '../../../../core/models/sale.model';
import { GenericService } from '../../../../core/services/generic-service/generic.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button';
import { Client } from '../../../../core/models/client.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-sale',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent implements OnInit {
  sales: Sale[] = [];
  clients: Client[] = [];
  displayedColumns: string[] = ['id', 'titre', 'description', 'customer_id', 'materials', 'actions'];
  dataSource = new MatTableDataSource<Sale>();
  private baseUri = environment.baseUri;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private genericService: GenericService<Sale>,
    private genericServiceClient: GenericService<Client>,
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
      this.sales = response.sales;
      this.dataSource.data = response.sales;
    });
  }

  loadSales() {
    this.genericService.getAll(`${this.baseUri}/api/sale`).subscribe(sales => {
      this.sales = sales;
    });
  }

  viewSale(sale: Sale) {
    this.router.navigate(['/sale/show', sale.id]).then();
  }

  editSale(sale: Sale) {
    this.router.navigate(['/sale/edit', sale.id]).then();
  }

  deleteSale(sale: Sale) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Voulez-vous vraiment supprimer ce sale ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.genericService.delete(`${this.baseUri}/api/sale`, sale.id).subscribe(() => {
          this.loadSales();
          const updatedData = this.dataSource.data.filter(item => item.id !== sale.id);
          this.dataSource.data = updatedData;
          this.table.renderRows();
        });
      }
    });
  }

  goToAddClient() {
    this.router.navigate(['/sale/add']).then();
  }
}
