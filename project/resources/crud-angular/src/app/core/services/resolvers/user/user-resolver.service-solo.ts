import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { GenericService } from "../../generic-service/generic.service";
import { User } from '../../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog.component';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class userResolverSolo implements Resolve<any> {
  private baseUri = environment.baseUri;

  constructor(private user: GenericService<User>, private dialog: MatDialog) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = Number(route.params['id']);
    return this.user.getById(`${this.baseUri}/api/utilisateur`, id).pipe(
      catchError(error => {
        this.showErrorDialog(error.message);
        return of('No data');
      })
    );
  }

  private showErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '300px',
      data: { message }
    });
  }
}
