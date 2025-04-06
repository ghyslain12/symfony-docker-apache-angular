import { Routes } from '@angular/router';
import { SaleComponent } from './components/sale/sale.component';
import { saleResolver } from '../../core/services/resolvers/sale/sale-resolver.service';
import { saleResolverSolo } from '../../core/services/resolvers/sale/sale-resolver.service-solo';
import { SaleFormComponent } from './components/sale/sale-form/sale-form.component';
import { materialResolver } from '../../core/services/resolvers/material/material-resolver.service';
import { clientResolver } from '../../core/services/resolvers/client/client-resolver.service';
import { SaleShowComponent } from './components/sale/sale-show/sale-show.component';



export const provisioningRoutes: Routes = [
    { path: '', component: SaleComponent, resolve: {sales: saleResolver} },
    { path: 'add', component: SaleFormComponent, resolve: {materials: materialResolver, clients: clientResolver} },
    { path: 'edit/:id', component: SaleFormComponent, resolve: {sale: saleResolverSolo, materials: materialResolver, clients: clientResolver} },
    { path: 'show/:id', component: SaleShowComponent, resolve: {sale: saleResolverSolo} }
];

