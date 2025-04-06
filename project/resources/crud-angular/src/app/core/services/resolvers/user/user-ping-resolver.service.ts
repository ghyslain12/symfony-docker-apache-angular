import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import {catchError} from 'rxjs/operators';

import { GenericService } from "../../generic-service/generic.service";
import { User } from '../../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog.component';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class userPingResolver implements Resolve<any> {
  private baseUri = environment.baseUri;

  constructor(private user: GenericService<User[]>, private dialog: MatDialog) {}
  resolve(): Observable<any> {
    return this.user.get(`${this.baseUri}/api/utilisateur/ping`).pipe(
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
