import { Component } from '@angular/core';
import { User } from '../../../../../core/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-show',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './user-show.component.html',
  styleUrl: './user-show.component.css'
})
export class UserShowComponent {
  user: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.data.subscribe((response: any) => {
      this.user = response.user;
    });
  }

  goBack() {
    this.router.navigate(['/user']).then();
  }
}
