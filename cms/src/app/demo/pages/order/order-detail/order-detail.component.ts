import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { OrderService, Order } from 'src/app/services/order.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  orderId: string;
  loading = false;
  updating = false;

  // ✅ CHỈ cho phép cập nhật status và note - LOẠI BỎ payment_status
  orderStatusForm = {
    status: '',
    note: ''
  };

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private orderService: OrderService,
    private toastService: ToastService
  ) {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if (this.orderId) {
      this.loadOrderDetails();
    } else {
      this.toastService.error('Lỗi', 'ID đơn hàng không hợp lệ');
      this.router.navigate(['/order']);
    }
  }

  // ✅ Load order details từ API
  loadOrderDetails(): void {
    this.loading = true;
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
        
        if (!order) {
          this.toastService.error('Lỗi', 'Không tìm thấy đơn hàng');
          this.router.navigate(['/order']);
        } else {
          // ✅ Khởi tạo form với giá trị hiện tại - LOẠI BỎ payment_status
          this.orderStatusForm = {
            status: order.status,
            note: order.note || ''
          };
        }
        
      },
      error: (err) => {
        console.error('Lỗi khi tải thông tin đơn hàng:', err);
        this.loading = false;
        
        let errorMessage = 'Không thể tải thông tin đơn hàng. Vui lòng thử lại sau!';
        if (err?.status === 404) {
          errorMessage = 'Đơn hàng không tồn tại!';
        } else if (err?.status === 403) {
          errorMessage = 'Bạn không có quyền xem đơn hàng này!';
        }
        
        this.toastService.error('Lỗi', errorMessage);
        this.router.navigate(['/order']);
      }
    });
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
      case 'cod': return 'Tiền mặt khi nhận hàng';
      case 'bank_transfer': return 'Chuyển khoản ngân hàng';
      case 'momo': return 'Ví điện tử MoMo';
      case 'zalopay': return 'Ví điện tử ZaloPay';
      default: return 'Không xác định';
    }
  }

  navigateBack(): void {
    this.router.navigate(['/order']);
  }

  // ✅ CHỈ cập nhật trạng thái đơn hàng - LOẠI BỎ payment_status
  updateOrderStatus(): void {
    if (!this.order) {
      this.toastService.error('Lỗi', 'Không tìm thấy thông tin đơn hàng');
      return;
    }

    // ✅ Kiểm tra có thay đổi gì không - LOẠI BỎ payment_status
    if (this.orderStatusForm.status === this.order.status && 
        this.orderStatusForm.note === (this.order.note || '')) {
      this.toastService.info('Thông báo', 'Không có thay đổi nào để cập nhật');
      return;
    }

    this.updating = true;

    // ✅ Giữ nguyên payment_status hiện tại - KHÔNG thay đổi
    this.orderService.updateOrderStatus(
      this.order.id,
      this.orderStatusForm.status,
      this.order.payment_status, // ✅ Sử dụng giá trị hiện tại
      this.orderStatusForm.note
    ).subscribe({
      next: success => {
        this.updating = false;
        
        if (success) {
          this.toastService.success('Thành công', 'Cập nhật trạng thái đơn hàng thành công!');
          
          // ✅ Cập nhật lại order object với giá trị mới - LOẠI BỎ payment_status
          if (this.order) {
            this.order.status = this.orderStatusForm.status as any;
            this.order.note = this.orderStatusForm.note;
            // payment_status giữ nguyên
          }
          
          // Reload order details để đảm bảo data mới nhất
          this.loadOrderDetails();
        } else {
          this.toastService.error('Lỗi', 'Cập nhật trạng thái thất bại!');
        }
      },
      error: err => {
        console.error('Lỗi khi cập nhật trạng thái:', err);
        this.updating = false;
        
        let errorMessage = 'Đã xảy ra lỗi khi cập nhật trạng thái!';
        if (err?.error?.message) {
          errorMessage = err.error.message;
        } else if (err?.status === 404) {
          errorMessage = 'Đơn hàng không tồn tại!';
        } else if (err?.status === 403) {
          errorMessage = 'Bạn không có quyền cập nhật đơn hàng này!';
        } else if (err?.status === 400) {
          errorMessage = 'Dữ liệu cập nhật không hợp lệ!';
        }
        
        this.toastService.error('Lỗi', errorMessage);
      }
    });
  }

  // ✅ Reset form về giá trị ban đầu - LOẠI BỎ payment_status
  resetForm(): void {
    if (this.order) {
      this.orderStatusForm = {
        status: this.order.status,
        note: this.order.note || ''
      };
      this.toastService.info('Đã reset', 'Form đã được reset về giá trị ban đầu');
    }
  }

  // ✅ Kiểm tra có thay đổi không - LOẠI BỎ payment_status
  hasChanges(): boolean {
    if (!this.order) return false;
    
    return this.orderStatusForm.status !== this.order.status || 
           this.orderStatusForm.note !== (this.order.note || '');
  }

  printOrder(): void {
    // Implementation for printing order
    window.print();
  }

  // ✅ THÊM method để handle image error
  onImageError(event: any): void {
    const target = event.target as HTMLImageElement;
    target.src = this.getDefaultProductImage();
  }

  // ✅ THÊM method để handle image load success
  onImageLoad(event: any): void {
    const target = event.target as HTMLImageElement;
    target.style.opacity = '1';
  }

  // ✅ THÊM method để get default image
  getDefaultProductImage(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04NS4zMzMzIDY2LjY2NjdIMTE0LjY2N1Y4MC4wMDAxSDEyOFY5My4zMzM0SDExNC42NjdWMTA2LjY2N0g4NS4zMzMzVjkzLjMzMzRINzJWODAuMDAwMUg4NS4zMzMzVjY2LjY2NjdaIiBmaWxsPSIjOUNBM0FGII8+CjxwYXRoIGQ9Ik04NSAyOEM4NSAyNi44OTU0IDg1Ljg5NTQgMjYgODcgMjZIMTEzQzExNC4xMDUgMjYgMTE1IDI2Ljg5NTQgMTE1IDI4VjQwSDg1VjI4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
  }

  // ✅ THÊM method để check và validate image src
  getImageSrc(item: any): string {
    if (!item.product_image) {
      return this.getDefaultProductImage();
    }
    
    // ✅ Kiểm tra nếu là URL hợp lệ
    try {
      const url = new URL(item.product_image);
      return item.product_image;
    } catch {
      // Nếu không phải URL hợp lệ, sử dụng default
      return this.getDefaultProductImage();
    }
  }

  // ✅ THÊM method để check image loading state
  isImageLoading(item: any): boolean {
    return !item.product_image || item.product_image === '';
  }
}