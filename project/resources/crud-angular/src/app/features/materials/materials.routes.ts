import { Routes } from '@angular/router';
import { materialResolver } from '../../core/services/resolvers/material/material-resolver.service';
import { materialResolverSolo } from '../../core/services/resolvers/material/material-resolver.service-solo';
import { MaterialFormComponent } from './components/material/material-form/material-form.component';
import { MaterialComponent } from './components/material/material.component';
import { materialPingResolver } from '../../core/services/resolvers/material/material-ping-resolver.service';
import { MaterialShowComponent } from './components/material/material-show/material-show.component';



export const materialsRoutes: Routes = [
    { path: '', component: MaterialComponent, resolve: {materials: materialResolver} },
    { path: 'add', component: MaterialFormComponent, resolve: {ping: materialPingResolver} },
    { path: 'edit/:id', component: MaterialFormComponent, resolve: {material: materialResolverSolo} },
    { path: 'show/:id', component: MaterialShowComponent, resolve: {material: materialResolverSolo} }
];

