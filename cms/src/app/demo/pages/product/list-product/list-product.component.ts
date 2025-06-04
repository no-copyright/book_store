import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProductService, Product } from 'src/app/services/product.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss'
})
export class ListProductComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchKeyword: string = '';
  loading: boolean = false;
  Math = Math;
  
  // Phân trang
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;

  constructor(
    private router: Router, 
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProductsForUI().subscribe({
      next: (response) => {
        this.products = response.products;
        this.filteredProducts = [...response.products];
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        // ✅ Removed console.error - only show user-friendly messages
        if (error.status === 401) {
          this.toastService.warning('Cảnh báo', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (error.status === 0) {
          this.toastService.error('Lỗi kết nối', 'Không thể kết nối đến server. Đang sử dụng dữ liệu mẫu.');
        } else {
          this.toastService.error('Lỗi', 'Có lỗi xảy ra khi tải danh sách sản phẩm');
        }
        
        this.loading = false;
      }
    });
  }

  searchProducts(): void {
    if (!this.searchKeyword.trim()) {
      this.filteredProducts = [...this.products];
    } else {
      const keyword = this.searchKeyword.toLowerCase();
      this.filteredProducts = this.products.filter(product => 
        product.name?.toLowerCase().includes(keyword) ||
        product.code?.toLowerCase().includes(keyword) ||
        product.publisher?.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword) ||
        product.title?.toLowerCase().includes(keyword)
      );
    }
    
    this.totalItems = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;

    if (this.filteredProducts.length === 0 && this.searchKeyword.trim()) {
      this.toastService.info('Tìm kiếm', `Không tìm thấy sản phẩm nào với từ khóa "${this.searchKeyword}"`);
    } else if (this.searchKeyword.trim()) {
      this.toastService.success('Tìm kiếm', `Tìm thấy ${this.filteredProducts.length} sản phẩm với từ khóa "${this.searchKeyword}"`);
    }
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/product/add-product']);
  }

  navigateToEditProduct(id: string | number): void {
    this.router.navigate(['/product/edit-product', id.toString()]);
  }

  deleteProduct(id: string | number): void {
    const product = this.products.find(p => p.id.toString() === id.toString());
    const productName = product?.name || product?.title || `Sản phẩm #${id}`;
    
    this.toastService.showConfirmation(
      'Xác nhận xóa sản phẩm',
      `Bạn có chắc chắn muốn xóa sản phẩm "${productName}"? Hành động này không thể hoàn tác.`,
      () => this.confirmDeleteProduct(id),
      () => this.toastService.info('Đã hủy', 'Hành động xóa sản phẩm đã được hủy')
    );
  }

  private confirmDeleteProduct(id: string | number): void {
    const product = this.products.find(p => p.id.toString() === id.toString());
    
    this.productService.deleteProduct(id.toString()).subscribe({
      next: (success) => {
        if (success) {
          this.toastService.success(
            'Thành công', 
            `Xóa sản phẩm "${product?.name || product?.title || 'sản phẩm'}" thành công!`
          );
          this.loadProducts();
        } else {
          this.toastService.error('Lỗi', 'Không thể xóa sản phẩm này!');
        }
      },
      error: (error) => {
        // ✅ Removed console.error
        let errorMessage = 'Đã xảy ra lỗi khi xóa sản phẩm!';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.status === 403) {
          errorMessage = 'Bạn không có quyền xóa sản phẩm này!';
        } else if (error?.status === 404) {
          errorMessage = 'Sản phẩm không tồn tại!';
        }
        
        this.toastService.error('Lỗi', errorMessage);
      }
    });
  }

  toggleProductStatus(product: Product): void {
    const newStatus = !product.active;
    const statusText = newStatus ? 'kích hoạt' : 'vô hiệu hóa';
    
    this.toastService.showConfirmation(
      'Xác nhận thay đổi trạng thái',
      `Bạn có chắc chắn muốn ${statusText} sản phẩm "${product.name || product.title}"?`,
      () => this.confirmToggleStatus(product, newStatus),
      () => this.toastService.info('Đã hủy', 'Hành động thay đổi trạng thái đã được hủy')
    );
  }

  private confirmToggleStatus(product: Product, newStatus: boolean): void {
    this.productService.toggleProductActive(product.id.toString(), product.active).subscribe({
      next: (success) => {
        if (success) {
          product.active = newStatus;
          const statusText = newStatus ? 'kích hoạt' : 'vô hiệu hóa';
          this.toastService.success('Thành công', `Đã ${statusText} sản phẩm "${product.name || product.title}" thành công!`);
        } else {
          this.toastService.error('Lỗi', 'Không thể thay đổi trạng thái sản phẩm!');
        }
      },
      error: (error) => {
        // ✅ Removed console.error
        this.toastService.error('Lỗi', 'Đã xảy ra lỗi khi thay đổi trạng thái sản phẩm!');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-secondary';
      case 'out_of_stock': return 'bg-danger';
      default: return 'bg-info';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'out_of_stock': return 'Hết hàng';
      default: return 'Không xác định';
    }
  }

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
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get pagedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  getProductImageSrc(product: Product): string {
    if (product.thumbnail && product.thumbnail !== 'null' && product.thumbnail.trim() !== '') {
      return product.thumbnail;
    }
    
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }
    
    return 'assets/images/product-placeholder.jpg';
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/product-placeholder.jpg';
  }
}