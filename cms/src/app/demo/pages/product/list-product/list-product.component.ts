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
  
  // Phân trang
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  Math = Math;
  
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
    
    console.log(`Loading products - Page: ${this.currentPage}, Size: ${this.pageSize}`);
    
    this.productService.getProductsForUI(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.products = response.products;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage; // ✅ Cập nhật currentPage từ response
        this.loading = false;
        
        console.log('Products loaded:', {
          page: this.currentPage,
          totalPages: this.totalPages,
          totalElements: this.totalItems,
          products: this.products.length
        });
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
        this.toastService.error('Lỗi', 'Không thể tải danh sách sản phẩm!');
      }
    });
  }

  searchProducts(): void {
    if (!this.searchKeyword.trim()) {
      // Reset về trang 1 khi clear search
      this.currentPage = 1;
      this.loadProducts();
      return;
    }

    this.loading = true;
    // Reset về trang 1 khi search
    this.currentPage = 1;
    
    console.log(`Searching products: "${this.searchKeyword}" - Page: ${this.currentPage}`);
    
    this.productService.searchProducts(this.searchKeyword, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.products = response.products;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.loading = false;
        
        console.log('Search results:', {
          keyword: this.searchKeyword,
          totalFound: this.totalItems,
          page: this.currentPage,
          totalPages: this.totalPages
        });
        
        if (this.totalItems === 0) {
          this.toastService.info('Tìm kiếm', `Không tìm thấy sản phẩm nào với từ khóa "${this.searchKeyword}"`);
        } else {
          this.toastService.success('Tìm kiếm', `Tìm thấy ${this.totalItems} sản phẩm`);
        }
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.loading = false;
        this.toastService.error('Lỗi', 'Không thể tìm kiếm sản phẩm!');
      }
    });
  }

  // ✅ THÊM method để search với pagination
  searchProductsWithPagination(): void {
    if (!this.searchKeyword.trim()) {
      this.loadProducts();
      return;
    }

    this.loading = true;
    
    console.log(`Searching with pagination: "${this.searchKeyword}" - Page: ${this.currentPage}`);
    
    this.productService.searchProducts(this.searchKeyword, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.products = response.products;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.loading = false;
        
        console.log('Search pagination results:', {
          keyword: this.searchKeyword,
          page: this.currentPage,
          totalPages: this.totalPages,
          results: this.products.length
        });
      },
      error: (error) => {
        console.error('Error searching products with pagination:', error);
        this.loading = false;
        this.toastService.error('Lỗi', 'Không thể tải trang kết quả tìm kiếm!');
      }
    });
  }

  // ✅ CẬP NHẬT method changePage để support cả normal và search
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      console.log('Changing to page:', page);
      this.currentPage = page;
      
      // ✅ Gọi lại loadProducts để load data mới
      this.loadProducts();
    }
  }

  clearSearch(): void {
    console.log('Clearing search');
    this.searchKeyword = '';
    this.currentPage = 1;
    this.loadProducts();
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
    
    // Điều chỉnh startPage nếu cần
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // ✅ THÊM method để jump to specific page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.changePage(page);
    }
  }

  // ✅ THÊM method để change page size
  changePageSize(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.currentPage = 1; // Reset về trang 1
    
    if (this.searchKeyword.trim()) {
      this.searchProducts();
    } else {
      this.loadProducts();
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
    
    return 'assets/images/placeholder.png';
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.png';
  }
}