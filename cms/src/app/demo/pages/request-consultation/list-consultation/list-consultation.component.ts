import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ConsultationService, Consultation } from 'src/app/services/consultation.service';
import { ToastService } from 'src/app/services/toast.service'; // ✅ Import ToastService
import { ViewConsultationComponent } from '../view-consultation/view-consultation.component';

@Component({
  selector: 'app-list-consultation',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './list-consultation.component.html',
  styleUrls: ['./list-consultation.component.scss']
})
export class ListConsultationComponent implements OnInit {
  consultationList: Consultation[] = [];
  loading: boolean = false;
  Math = Math;

  // Phân trang
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 1;

  constructor(
    private consultationService: ConsultationService,
    private modalService: NgbModal,
    private toastService: ToastService // ✅ Inject ToastService
  ) {}

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.loading = true;
    this.consultationService.getConsultationsForUI('desc', this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.consultationList = response.consultations;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading consultations:', error);
        
        // Hiển thị thông báo lỗi chi tiết
        if (error.status === 401) {
          this.toastService.warning('Cảnh báo', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (error.status === 0) {
          this.toastService.error('Lỗi kết nối', 'Không thể kết nối đến server. Đang sử dụng dữ liệu mẫu.');
        } else {
          this.toastService.error('Lỗi', 'Có lỗi xảy ra khi tải danh sách yêu cầu tư vấn');
        }
        
        this.loading = false;
      }
    });
  }

  viewDetails(consultation: Consultation): void {
    const modalRef = this.modalService.open(ViewConsultationComponent, { 
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.consultation = consultation;
  }

  // ✅ Cập nhật deleteConsultation để sử dụng ToastService
  deleteConsultation(id: number): void {
    // Tìm consultation để hiển thị thông tin trong confirmation
    const consultation = this.consultationList.find(c => c.id === id);
    const customerName = consultation?.name || `Yêu cầu #${id}`;
    
    // Sử dụng ToastService để hiển thị confirmation
    this.toastService.showConfirmation(
      'Xác nhận xóa yêu cầu tư vấn',
      `Bạn có chắc chắn muốn xóa yêu cầu tư vấn của "${customerName}"? Hành động này không thể hoàn tác.`,
      () => this.confirmDeleteConsultation(id),
      () => this.toastService.info('Đã hủy', 'Hành động xóa yêu cầu tư vấn đã được hủy')
    );
  }

  // ✅ Method riêng để xử lý xóa sau khi confirm
  private confirmDeleteConsultation(id: number): void {
    const consultation = this.consultationList.find(c => c.id === id);
    
    this.consultationService.deleteConsultation(id).subscribe({
      next: (success) => {
        if (success) {
          this.toastService.success(
            'Thành công', 
            `Xóa yêu cầu tư vấn của "${consultation?.name || 'khách hàng'}" thành công!`
          );
          
          // Reload data after delete
          this.loadConsultations();
        } else {
          this.toastService.error('Lỗi', 'Không thể xóa yêu cầu tư vấn này!');
        }
      },
      error: (error) => {
        console.error('Error deleting consultation:', error);
        
        let errorMessage = 'Đã xảy ra lỗi khi xóa yêu cầu tư vấn!';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.status === 403) {
          errorMessage = 'Bạn không có quyền xóa yêu cầu tư vấn này!';
        } else if (error?.status === 404) {
          errorMessage = 'Yêu cầu tư vấn không tồn tại!';
        }
        
        this.toastService.error('Lỗi', errorMessage);
      }
    });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
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
      this.loadConsultations(); // Load new data for new page
    }
  }

  get pagedConsultations(): Consultation[] {
    // Vì đang sử dụng server-side pagination, return consultationList trực tiếp
    return this.consultationList;
  }
}