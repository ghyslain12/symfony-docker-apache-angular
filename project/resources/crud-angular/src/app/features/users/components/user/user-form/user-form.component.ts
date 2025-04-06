import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericService } from '../../../../../core/services/generic-service/generic.service';
import { User } from '../../../../../core/models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../../../../environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {ErrorDialogComponent} from '../../../../../shared/components/error-dialog.component';
import {AuthService} from '../../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatLabel,
    MatInput,
    MatFormFieldModule,
    MatCardModule,
  ],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit{
  userForm: FormGroup;
  isEditMode = false;
  userId?: number;
  titrePage = "Ajouter";
  private baseUri = environment.baseUri;

  constructor(
    private fb: FormBuilder,
    private genericService: GenericService<User>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', null],
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      this.titrePage = 'Modifier';
      this.isEditMode = true;
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.loadUser();
    }
  }

  loadUser() {
    this.route.data.subscribe((response: any) => {
      this.userForm.patchValue(response.user);
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      const request = this.isEditMode && this.userId
        ? this.genericService.update(`${this.baseUri}/api/utilisateur`, this.userId, userData)
        : this.genericService.create(`${this.baseUri}/api/utilisateur`, userData);

      request.subscribe({
        next: () => {
          if(this.authService.isAuthenticated()) {
            this.router.navigate(['/user']).then();
          } else {
            this.router.navigate(['/login']).then();
          }
        },
        error: (err) => {
          this.showErrorDialog('Erreur lors de la création de l’utilisateur : ' + (err.message || 'Vérifiez votre connexion ou les données saisies.'));
        }
      });
    }
  }

  public showErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '300px',
      data: { message }
    });
  }

  goBack() {
    if(this.authService.isAuthenticated()) {
      this.router.navigate(['/user']).then();
    } else {
      this.router.navigate(['/login']).then();
    }
  }
}
