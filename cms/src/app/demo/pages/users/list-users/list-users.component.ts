import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService, User } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss'
})
export class ListUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchKeyword: string = '';
  loading: boolean = false;
  Math = Math;
  
  // Phân trang
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsersForUI(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.applyFilters(); // Áp dụng filter sau khi load data
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.users];
    
    // Chỉ áp dụng tìm kiếm, bỏ filter theo trạng thái
    if (this.searchKeyword) {
      const keyword = this.searchKeyword.toLowerCase();
      result = result.filter(user => 
        user.username.toLowerCase().includes(keyword) || 
        user.email.toLowerCase().includes(keyword) || 
        user.role?.toLowerCase().includes(keyword)
      );
    }
    
    this.filteredUsers = result;
  }

  searchUsers(): void {
    this.currentPage = 1; // Reset về trang đầu khi tìm kiếm
    this.loadUsers(); // Load lại data từ server
  }

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

  navigateToEditUser(id: string): void {
    this.router.navigate(['/users/edit', id]);
  }

  // Phân trang
  getPageNumbers(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadUsers(); // Load new data for new page
    }
  }

  get pagedUsers(): User[] {
    // Vì đang sử dụng server-side pagination, return filteredUsers trực tiếp
    return this.filteredUsers;
  }
}