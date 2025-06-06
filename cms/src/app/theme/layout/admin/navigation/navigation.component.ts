// angular import
import { Component, OnInit, output, HostListener } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavLogoComponent } from './nav-logo/nav-logo.component';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationItem, NavigationItems } from './navigation';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [SharedModule, NavLogoComponent, CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  // public props
  NavCollapse = output();
  NavCollapsedMob = output();
  navCollapsed: boolean;
  navCollapsedMob: boolean;
  windowWidth: number;
  navigation: NavigationItem[] = [];
  
  // ✅ THÊM state để quản lý collapse menus
  openMenus: Set<string> = new Set();

  constructor(
    private authService: AuthService,
    private router: Router // ✅ THÊM Router
  ) {
    this.windowWidth = window.innerWidth;
    this.navCollapsedMob = false;
  }

  ngOnInit(): void {
    this.buildNavigation();
    
    // ✅ Subscribe để rebuild navigation khi user thay đổi
    this.authService.currentUser$.subscribe(() => {
      this.buildNavigation();
    });
  }

  // ✅ Build navigation dựa vào role
  private buildNavigation(): void {
    this.navigation = NavigationItems.filter(item => this.isMenuVisible(item.id))
      .map(item => ({
        ...item,
        children: item.children?.filter(child => this.isMenuVisible(child.id))
          .map(child => ({
            ...child,
            children: child.children?.filter(subChild => this.isMenuVisible(subChild.id))
          }))
      }));
  }

  // ✅ Check visibility dựa vào role
  isMenuVisible(menuId: string): boolean {
    switch (menuId) {
      case 'users':
        return this.authService.canAccessUsers(); // Chỉ ADMIN
      case 'product':
      case 'list-product':
      case 'add-product':
        return this.authService.canAccessProducts(); // ADMIN và STAFF
      case 'order':
      case 'list-order':
        return this.authService.canAccessOrders(); // ADMIN và STAFF
      case 'category':
      case 'list-category':
      case 'add-category':
        return this.authService.canAccessCategories(); // ADMIN và STAFF
      case 'article':
      case 'list-article':
      case 'add-article':
        return this.authService.canAccessArticles(); // ADMIN và STAFF
      case 'consultation':
      case 'list-consultation':
        return this.authService.canAccessConsultations(); // ADMIN và STAFF
      case 'evaluate':
      case 'list-evaluate':
        return this.authService.canAccessEvaluates(); // ADMIN và STAFF
      case 'main':
      case 'admin':
      default:
        return true;
    }
  }

  // ✅ THÊM method để toggle collapse menu
  toggleMenu(menuId: string): void {
    
    if (this.openMenus.has(menuId)) {
      this.openMenus.delete(menuId);
    } else {
      this.openMenus.add(menuId);
    }
  }

  // ✅ THÊM method để check menu có open không
  isMenuOpen(menuId: string): boolean {
    return this.openMenus.has(menuId);
  }

  // ✅ THÊM method để navigate trực tiếp
  navigateToPage(url: string): void {
    this.router.navigate([url]);
  }

  // public method
  navCollapse() {
    if (this.windowWidth >= 992) {
      this.navCollapsed = !this.navCollapsed;
      this.NavCollapse.emit();
    }
  }

  navCollapseMob() {
    if (this.windowWidth < 992) {
      this.NavCollapsedMob.emit();
    }
  }

  // ✅ THÊM listener để đóng menu khi click outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any): void {
    if (!event.target.closest('.pcoded-hasmenu')) {
      // Có thể giữ menu mở hoặc đóng tùy theo UX mong muốn
    }
  }
}
