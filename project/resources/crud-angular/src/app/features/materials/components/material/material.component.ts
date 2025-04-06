import { Component, OnInit, ViewChild } from '@angular/core';
import { Material } from '../../../../core/models/material.model';
import { GenericService } from '../../../../core/services/generic-service/generic.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-material',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './material.component.html',
  styleUrl: './material.component.css'
})
export class MaterialComponent implements OnInit {
  materials: Material[] = [];
  displayedColumns: string[] = ['id', 'designation', 'actions'];
  dataSource = new MatTableDataSource<Material>();
  private baseUri = environment.baseUri;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private genericService: GenericService<Material>,
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
      this.materials = response.materials;
      this.dataSource.data = response.materials;
    });
  }

  loadMaterials() {
    this.genericService.getAll(`${this.baseUri}/api/material`).subscribe(materials => {
      this.materials = materials;
    });
  }

  viewMaterial(material: Material) {
    this.router.navigate(['/material/show', material.id]).then();
  }

  editMaterial(material: Material) {
    this.router.navigate(['/material/edit', material.id]).then();
  }

  deleteMaterial(material: Material) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Voulez-vous vraiment supprimer ce materiel ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.genericService.delete(`${this.baseUri}/api/material`, material.id).subscribe(() => {
          this.loadMaterials();
          const updatedData = this.dataSource.data.filter(item => item.id !== material.id);
          this.dataSource.data = updatedData;
          this.table.renderRows();
        });
      }
    });
  }

  goToAddMaterial() {
    this.router.navigate(['/material/add']).then();
  }
}
