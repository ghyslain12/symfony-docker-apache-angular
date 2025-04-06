import { Component } from '@angular/core';
import { Sale } from '../../../../../core/models/sale.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sale-show',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './sale-show.component.html',
  styleUrl: './sale-show.component.css'
})
export class SaleShowComponent {
  sale: Sale | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.data.subscribe((response: any) => {
      this.sale = response.sale;
    });
  }

  goBack() {
    this.router.navigate(['/sale']).then();
  }
}
