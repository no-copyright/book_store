import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService, User, Role } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule], // ✅ THÊM FormsModule
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  user: User | null = null;
  userId: string;
  loading = false;
  
  // ✅ THÊM properties cho roles management
  availableRoles: Role[] = [];
  selectedRoles: string[] = [];
  originalRoles: string[] = [];
  rolesLoading = false;
  updatingRoles = false;
  showRolesEditor = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadAvailableRoles();
  }

  loadUserData(): void {
    this.loading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          // ✅ Lưu roles hiện tại
          this.originalRoles = user.roles?.map(role => role.name) || [];
          this.selectedRoles = [...this.originalRoles];
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

  // ✅ THÊM method để load available roles
  loadAvailableRoles(): void {
    this.rolesLoading = true;
    this.userService.getAllRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
        console.log('Loaded available roles:', this.availableRoles);
        this.rolesLoading = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.toastService.error('Lỗi', 'Không thể tải danh sách quyền');
        this.rolesLoading = false;
        
        // Fallback roles
        this.availableRoles = [
          { name: 'ADMIN', description: 'Quyền quản trị viên', permissions: [] },
          { name: 'USER', description: 'Quyền người dùng thông thường', permissions: [] },
          { name: 'STAFF', description: 'Quyền nhân viên', permissions: [] }
        ];
      }
    });
  }

  // ✅ THÊM methods cho roles management
  toggleRolesEditor(): void {
    this.showRolesEditor = !this.showRolesEditor;
    if (this.showRolesEditor) {
      // Reset về roles ban đầu khi mở editor
      this.selectedRoles = [...this.originalRoles];
    }
  }

  // Check if role is selected
  isRoleSelected(roleName: string): boolean {
    return this.selectedRoles.includes(roleName);
  }

  // Toggle role selection
  toggleRole(roleName: string): void {
    const index = this.selectedRoles.indexOf(roleName);
    if (index > -1) {
      // Remove role
      this.selectedRoles.splice(index, 1);
    } else {
      // Add role
      this.selectedRoles.push(roleName);
    }
    console.log('Selected roles updated:', this.selectedRoles);
  }

  // Check if roles have changed
  hasRolesChanged(): boolean {
    if (this.selectedRoles.length !== this.originalRoles.length) {
      return true;
    }
    return !this.selectedRoles.every(role => this.originalRoles.includes(role));
  }

  // Update user roles
  updateUserRoles(): void {
    if (!this.user) return;

    if (this.selectedRoles.length === 0) {
      this.toastService.warning('Cảnh báo', 'Vui lòng chọn ít nhất một quyền cho người dùng!');
      return;
    }

    this.updatingRoles = true;

    this.userService.updateUserRoles(this.userId, this.selectedRoles).subscribe({
      next: (success) => {
        if (success) {
          this.toastService.success('Thành công', 
            `Cập nhật quyền cho người dùng "${this.user!.username}" thành công!`);
          
          // Cập nhật dữ liệu local
          this.originalRoles = [...this.selectedRoles];
          
          // Reload user data để cập nhật UI
          this.loadUserData();
          this.showRolesEditor = false;
        } else {
          this.toastService.error('Lỗi', 'Không thể cập nhật quyền người dùng!');
        }
        this.updatingRoles = false;
      },
      error: (error) => {
        console.error('Error updating user roles:', error);
        
        let errorMessage = 'Đã xảy ra lỗi khi cập nhật quyền!';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.status === 403) {
          errorMessage = 'Bạn không có quyền cập nhật quyền người dùng này!';
        } else if (error?.status === 404) {
          errorMessage = 'Người dùng không tồn tại!';
        }
        
        this.toastService.error('Lỗi', errorMessage);
        this.updatingRoles = false;
      }
    });
  }

  // Cancel roles editing
  cancelRolesEditing(): void {
    this.selectedRoles = [...this.originalRoles];
    this.showRolesEditor = false;
  }

  // Get role display class
  getRoleClass(roleName: string): string {
    switch (roleName.toLowerCase()) {
      case 'admin': return 'bg-danger';
      case 'staff': return 'bg-warning';
      case 'user': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  // Get role text
  getRoleText(roleName: string): string {
    switch (roleName.toLowerCase()) {
      case 'admin': return 'Quản trị viên';
      case 'staff': return 'Nhân viên';
      case 'user': return 'Người dùng';
      default: return roleName;
    }
  }

  deleteUser(): void {
    if (!this.user) return;

    const userName = this.user.username;
    
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
}