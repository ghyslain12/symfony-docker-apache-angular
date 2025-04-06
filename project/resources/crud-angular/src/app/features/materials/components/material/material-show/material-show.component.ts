import { Component } from '@angular/core';
import { Material } from '../../../../../core/models/material.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-material-show',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './material-show.component.html',
  styleUrl: './material-show.component.css'
})
export class MaterialShowComponent {
  material: Material | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.data.subscribe((response: any) => {
      this.material = response.material;
    });
  }

  goBack() {
    this.router.navigate(['/material']).then();
  }
}
