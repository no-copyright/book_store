import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService, User } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  user: User | null = null;
  userId: string;
  loading = false;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        } else {
          this.toastService.error('Lỗi', 'Không tìm thấy người dùng!');
          this.router.navigate(['/users']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu người dùng:', err);
        this.toastService.error('Lỗi', 'Đã xảy ra lỗi khi tải thông tin người dùng!');
        this.loading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  deleteUser(): void {
    if (!this.user) return;

    const userName = this.user.username;
    
    // Sử dụng ToastService để hiển thị confirmation
    this.toastService.showConfirmation(
      'Xác nhận xóa người dùng',
      `Bạn có chắc chắn muốn xóa người dùng "${userName}"? Hành động này không thể hoàn tác.`,
      () => this.confirmDeleteUser(),
      () => this.toastService.info('Đã hủy', 'Hành động xóa người dùng đã được hủy')
    );
  }

  private confirmDeleteUser(): void {
    if (!this.user) return;

    this.userService.deleteUser(this.userId).subscribe({
      next: (success) => {
        if (success) {
          this.toastService.success('Thành công', `Xóa người dùng "${this.user!.username}" thành công!`);
          // Chuyển về trang danh sách sau khi xóa thành công
          setTimeout(() => {
            this.router.navigate(['/users']);
          }, 1500);
        } else {
          this.toastService.error('Lỗi', 'Không thể xóa người dùng này!');
        }
      },
      error: (error) => {
        console.error('Lỗi khi xóa người dùng:', error);
        
        let errorMessage = 'Đã xảy ra lỗi khi xóa người dùng!';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.status === 403) {
          errorMessage = 'Bạn không có quyền xóa người dùng này!';
        } else if (error?.status === 404) {
          errorMessage = 'Người dùng không tồn tại!';
        }
        
        this.toastService.error('Lỗi', errorMessage);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  // Utility methods để hiển thị role
  getRoleText(role: string | undefined): string {
    switch (role?.toLowerCase()) {
      case 'admin': return 'Quản trị viên';
      case 'staff': return 'Nhân viên';
      case 'user':
      case 'customer': return 'Khách hàng';
      default: return role || 'Chưa xác định';
    }
  }

  getRoleClass(role: string | undefined): string {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-danger';
      case 'staff': return 'bg-warning';
      case 'user':
      case 'customer': return 'bg-info';
      default: return 'bg-secondary';
    }
  }
}