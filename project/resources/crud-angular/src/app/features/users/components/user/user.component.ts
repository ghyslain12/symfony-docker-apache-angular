import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../../core/models/user.model';
import { GenericService } from '../../../../core/services/generic-service/generic.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'actions'];
  private baseUri = environment.baseUri;
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private genericService: GenericService<User>,
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
      this.dataSource.data = response.users;
    });
  }

  loadUsers() {
    this.genericService.getAll(`${this.baseUri}/api/utilisateur`).subscribe(users => {
      this.users = users;
    });
  }

  viewUser(user: User) {
    this.router.navigate(['/user/show', user.id]).then();
  }

  editUser(user: User) {
    this.router.navigate(['/user/edit', user.id]).then();
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Voulez-vous vraiment supprimer cet utilisateur ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.genericService.delete(`${this.baseUri}/api/utilisateur`, user.id).subscribe(() => {
          this.loadUsers();
          const updatedData = this.dataSource.data.filter(item => item.id !== user.id);
          this.dataSource.data = updatedData;
          this.table.renderRows();
        });
      }
    });
  }

  goToAddUser() {
    this.router.navigate(['/user/add']).then();
  }
}
