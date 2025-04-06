import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {
  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else if (error.status === 404) {
      return throwError(() => new Error('Not found'));
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Une erreur inconnue s\'est produite. Vérifiez la connexion à votre base de données.'));
  }

  get(baseUrl: string): Observable<T[]> {
    return this.http.get<T[]>(baseUrl).pipe(catchError(this.handleError));
  }

  getAll(baseUrl: string): Observable<T[]> {
    return this.http.get<T[]>(baseUrl).pipe(catchError(this.handleError));
  }

  getById(baseUrl: string, id: number): Observable<T> {
    return this.http.get<T>(`${baseUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(baseUrl: string, item: T): Observable<T> {
    return this.http.post<T>(baseUrl, item).pipe(catchError(this.handleError));
  }

  update(baseUrl: string, id: number, item: T): Observable<T> {
    return this.http.put<T>(`${baseUrl}/${id}`, item).pipe(catchError(this.handleError));
  }

  delete(baseUrl: string, id: number): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
