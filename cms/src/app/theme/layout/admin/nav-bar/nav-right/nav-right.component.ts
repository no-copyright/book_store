import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../../../services/auth.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-nav-right',
  standalone: true,
  imports: [CommonModule],
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
    // Subscribe để lấy thông tin user hiện tại
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Hàm đăng xuất
  logout(): void {
    // Hiển thị confirmation trước khi đăng xuất
    this.toastService.showConfirmation(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      () => this.confirmLogout(),
      () => this.toastService.info('Đã hủy', 'Hành động đăng xuất đã được hủy')
    );
  }

  private confirmLogout(): void {
    this.authService.logout();
    this.toastService.success('Thành công', 'Đăng xuất thành công!');
  }

  // Hàm chuyển đến trang profile (nếu có)
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}