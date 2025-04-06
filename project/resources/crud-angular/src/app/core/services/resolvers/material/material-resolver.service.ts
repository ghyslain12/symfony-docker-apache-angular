import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { GenericService } from "../../generic-service/generic.service";
import { Material } from '../../../models/material.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../../../shared/components/error-dialog.component';
import { environment } from '../../../../../environments/environment';
import { Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class materialResolver implements Resolve<any> {
  private baseUri = environment.baseUri;

  constructor(private material: GenericService<Material[]>, private dialog: MatDialog) {}
  resolve(): Observable<any> {
    return this.material.getAll(`${this.baseUri}/api/material`).pipe(
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
