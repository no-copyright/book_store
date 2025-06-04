import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { OrderService, Order } from 'src/app/services/order.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-list-order',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './list-order.component.html',
  styleUrl: './list-order.component.scss'
})
export class ListOrderComponent implements OnInit {
  Math = Math;
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchKeyword: string = '';
  statusFilter: string = 'all';
  loading: boolean = false;
  
  // Cho phân trang
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;

  constructor(
    private router: Router, 
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // ✅ Load orders từ API
  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrdersForUI(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.orders = response.orders;
        this.filteredOrders = [...this.orders];
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.handleLoadError(error);
        this.loading = false;
      }
    });
  }

  // ✅ Handle load error
  private handleLoadError(error: any): void {
    if (error.status === 401) {
      this.toastService.warning('Cảnh báo', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    } else if (error.status === 0) {
      this.toastService.error('Lỗi kết nối', 'Không thể kết nối đến server. Đang sử dụng dữ liệu mẫu.');
    } else {
      this.toastService.error('Lỗi', 'Có lỗi xảy ra khi tải danh sách đơn hàng');
    }
  }

  searchOrders(): void {
    if (!this.searchKeyword.trim()) {
      this.filteredOrders = [...this.orders];
      return;
    }

    this.filteredOrders = this.orders.filter(order => 
      order.id.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
      order.phone.includes(this.searchKeyword)
    );
    
    // Reset pagination for search results
    this.totalItems = this.filteredOrders.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;

    if (this.filteredOrders.length === 0) {
      this.toastService.info('Tìm kiếm', `Không tìm thấy đơn hàng nào với từ khóa "${this.searchKeyword}"`);
    } else if (this.searchKeyword.trim()) {
      this.toastService.success('Tìm kiếm', `Tìm thấy ${this.filteredOrders.length} đơn hàng với từ khóa "${this.searchKeyword}"`);
    }
  }

  filterOrders(): void {
    let filtered = [...this.orders];
    
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }

    if (this.searchKeyword.trim()) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        order.phone.includes(this.searchKeyword)
      );
    }

    this.filteredOrders = filtered;
    this.totalItems = this.filteredOrders.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
  }

  // ✅ CẬP NHẬT status mapping theo yêu cầu mới
  getOrderStatusClass(status: string): string {
    switch (status) {
      case 'delivered': return 'bg-success'; // giao hàng thành công
      case 'pending': return 'bg-warning text-dark'; // chờ xác nhận
      case 'waiting_carrier': return 'bg-info'; // chờ đơn vị vận chuyển
      case 'shipping': return 'bg-primary'; // đang vận chuyển
      case 'completed': return 'bg-success'; // đã giao
      case 'canceled': return 'bg-danger'; // đã huỷ
      default: return 'bg-secondary';
    }
  }

  getOrderStatusText(status: string): string {
    switch (status) {
      case 'delivered': return 'Giao hàng thành công';
      case 'pending': return 'Chờ xác nhận';
      case 'waiting_carrier': return 'Chờ đơn vị vận chuyển';
      case 'shipping': return 'Đang vận chuyển';
      case 'completed': return 'Đã giao';
      case 'canceled': return 'Đã huỷ';
      default: return 'Không xác định';
    }
  }

  // ✅ CẬP NHẬT payment status mapping theo yêu cầu mới
  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'bg-success'; // đã thanh toán
      case 'pending': return 'bg-warning text-dark'; // chưa thanh toán
      case 'refunded': return 'bg-info'; // đã hoàn tiền
      case 'failed': return 'bg-danger'; // không thành công
      case 'canceled': return 'bg-secondary'; // đã huỷ
      default: return 'bg-secondary';
    }
  }

  getPaymentStatusText(status: string): string {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chưa thanh toán';
      case 'refunded': return 'Đã hoàn tiền';
      case 'failed': return 'Không thành công';
      case 'canceled': return 'Đã huỷ';
      default: return 'Không xác định';
    }
  }

  getPaymentMethodText(method: string): string {
    switch (method) {
      case 'cod': return 'Tiền mặt';
      case 'bank_transfer': return 'Chuyển khoản';
      case 'momo': return 'MoMo';
      case 'zalopay': return 'ZaloPay';
      default: return 'Không xác định';
    }
  }

  // ✅ Xem chi tiết đơn hàng
  viewOrderDetails(id: string): void {
    if (!id) {
      this.toastService.error('Lỗi', 'ID đơn hàng không hợp lệ!');
      return;
    }

    this.router.navigate(['/order/order-detail', id]);
  }

  // ❌ LOẠI BỎ TẤT CẢ: deleteOrder, confirmDeleteOrder, canDeleteOrder

  // Logic phân trang
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
      this.loadOrders();
    }
  }

  get pagedOrders(): Order[] {
    if (this.searchKeyword.trim() || this.statusFilter !== 'all') {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredOrders.slice(startIndex, endIndex);
    }
    
    return this.filteredOrders;
  }

  // ✅ Clear search
  clearSearch(): void {
    const hadFilters = this.searchKeyword.trim() || this.statusFilter !== 'all';
    
    this.searchKeyword = '';
    this.statusFilter = 'all';
    this.filteredOrders = [...this.orders];
    this.totalItems = this.orders.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
    
    if (hadFilters) {
      this.toastService.info('Đã xóa bộ lọc', 'Hiển thị tất cả đơn hàng');
    }
  }

  // ✅ Refresh data
  refreshData(): void {
    this.loadOrders();
  }
}