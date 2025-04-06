import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy{
  logged: boolean = false;
  buttontyle = 'display: block; margin: auto;';
  private authSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  menuItems = [
    { label: 'Home', icon: 'fa-dashboard', route: '/home', isOpen: false, submenu: [] },
    { label: 'Provisioning', icon: 'fa-gear', route: null, isOpen: true, submenu: [{ label: 'sale', route: '/sale' }] },
    { label: 'Ticketing', icon: 'fa-gear', route: null, isOpen: true, submenu: [{ label: 'ticket', route: '/ticket' }] },
    { label: 'Users', icon: 'fa-gear', route: null, isOpen: true, submenu: [{ label: 'user', route: '/user' }, { label: 'client', route: '/client' }] },
    { label: 'Materials', icon: 'fa-gear', route: null, isOpen: true, submenu: [{ label: 'material', route: '/material' }] }
  ];

  toggleSubmenu(item: any) {
    item.isOpen = !item.isOpen;
  }

  ngOnInit() {
    this.authSubscription = this.authService.getLoggedInStatus().subscribe(isLoggedIn => {
      this.logged = isLoggedIn;
    });
  }

  ngOnDestroy() {}

  logout() {
    this.authService.logout(); // La mise à jour de logged se fera via l'observable
  }
}
