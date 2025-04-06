import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { GenericService } from "../../generic-service/generic.service";
import { Client } from '../../../models/client.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog.component';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class clientResolverSolo implements Resolve<any> {
  private baseUri = environment.baseUri;

  constructor(private client: GenericService<Client>, private dialog: MatDialog) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const id = Number(route.params['id']);
    return this.client.getById(`${this.baseUri}/api/client`, id).pipe(
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
