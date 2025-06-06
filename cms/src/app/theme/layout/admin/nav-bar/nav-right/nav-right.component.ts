import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-right',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // ✅ Format roles text
  getUserRolesText(): string {
    if (!this.currentUser?.roles || this.currentUser.roles.length === 0) {
      return 'Người dùng';
    }
    
    const roleTexts = this.currentUser.roles.map(role => {
      switch (role) {
        case 'ADMIN': return 'Quản trị viên';
        case 'STAFF': return 'Nhân viên';
        case 'USER': return 'Người dùng';
        default: return role;
      }
    });
    
    return roleTexts.join(', ');
  }

  // ✅ Get role badge class
  getRoleBadgeClass(): string {
    if (!this.currentUser?.roles) return 'bg-secondary';
    
    if (this.currentUser.roles.includes('ADMIN')) return 'bg-danger';
    if (this.currentUser.roles.includes('STAFF')) return 'bg-warning text-dark';
    return 'bg-info';
  }

  // ✅ ĐĂNG XUẤT TRỰC TIẾP - KHÔNG CẦN CONFIRM
  logout(): void {
    
    // Đăng xuất trực tiếp mà không cần confirm
    this.authService.logout();
    

  }

  // ✅ NẾU MUỐN GIỮ CONFIRM - SỬA LẠI METHOD NÀY
  logoutWithConfirm(): void {
    
    // Sử dụng confirm đơn giản thay vì ToastService
    if (confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      this.authService.logout();
    } else {
    }
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}