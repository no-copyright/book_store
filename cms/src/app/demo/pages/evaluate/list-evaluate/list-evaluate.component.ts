import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { EvaluateService, Evaluate } from 'src/app/services/evaluate.service';
import { ToastService } from 'src/app/services/toast.service';
import { ProductService } from 'src/app/services/product.service'; // ✅ Import ProductService
import { UserService } from 'src/app/services/user.service'; // ✅ Import UserService
import { forkJoin } from 'rxjs'; // ✅ Import forkJoin để gọi nhiều API cùng lúc

@Component({
  selector: 'app-list-evaluate',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './list-evaluate.component.html',
  styleUrl: './list-evaluate.component.scss'
})
export class ListEvaluateComponent implements OnInit {
  evaluates: Evaluate[] = [];
  filteredEvaluates: Evaluate[] = [];
  loading: boolean = false;
  
  // Bộ lọc và tìm kiếm
  searchKeyword: string = '';
  filterRating: number = 0;
  
  // Phân trang
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  Math = Math;

  // ✅ Cache để tránh gọi API nhiều lần
  private productCache = new Map<number, string>();
  private userCache = new Map<number, string>();

  constructor(
    private evaluateService: EvaluateService,
    private toastService: ToastService,
    private productService: ProductService, // ✅ Inject ProductService
    private userService: UserService // ✅ Inject UserService
  ) {}

  ngOnInit(): void {
    this.loadEvaluates();
  }

  loadEvaluates(): void {
    this.loading = true;
    this.evaluateService.getEvaluatesForUI(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.evaluates = response.evaluates;
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        
        // ✅ Load tên sản phẩm và user sau khi có data
        this.loadProductAndUserNames().then(() => {
          this.applyFilters();
          this.loading = false;
        });
      },
      error: (error) => {
        console.error('Error loading evaluates:', error);
        
        // Hiển thị thông báo lỗi chi tiết
        if (error.status === 401) {
          this.toastService.warning('Cảnh báo', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (error.status === 0) {
          this.toastService.error('Lỗi kết nối', 'Không thể kết nối đến server. Đang sử dụng dữ liệu mẫu.');
        } else {
          this.toastService.error('Lỗi', 'Có lỗi xảy ra khi tải danh sách đánh giá');
        }
        
        this.loading = false;
      }
    });
  }

  // ✅ Method để load tên sản phẩm và user từ ID
  private async loadProductAndUserNames(): Promise<void> {
    const productIds = [...new Set(this.evaluates.map(e => e.productId))];
    const userIds = [...new Set(this.evaluates.map(e => e.userId))];

    try {
      // Load tên sản phẩm
      await this.loadProductNames(productIds);
      
      // Load tên user  
      await this.loadUserNames(userIds);
      
      // Cập nhật evaluates với tên thực
      this.evaluates = this.evaluates.map(evaluate => ({
        ...evaluate,
        product_name: this.productCache.get(evaluate.productId) || `Sản phẩm #${evaluate.productId}`,
        user_name: this.userCache.get(evaluate.userId) || `User #${evaluate.userId}`
      }));
      
    } catch (error) {
      console.error('Error loading product/user names:', error);
      // Nếu lỗi, vẫn hiển thị với tên mặc định
      this.evaluates = this.evaluates.map(evaluate => ({
        ...evaluate,
        product_name: `Sản phẩm #${evaluate.productId}`,
        user_name: `User #${evaluate.userId}`
      }));
    }
  }

  // ✅ Load tên sản phẩm từ ProductService
  private async loadProductNames(productIds: number[]): Promise<void> {
    const uncachedProductIds = productIds.filter(id => !this.productCache.has(id));
    
    if (uncachedProductIds.length === 0) return;

    try {
      // Gọi API để lấy thông tin sản phẩm
      const productRequests = uncachedProductIds.map(id => 
        this.productService.getProductById(id.toString())
      );
      
      const products = await Promise.all(productRequests.map(req => 
        req.toPromise().catch(() => null)
      ));
      
      // Cache kết quả
      products.forEach((product, index) => {
        const productId = uncachedProductIds[index];
        if (product) {
          this.productCache.set(productId, product.title || product.name || `Sản phẩm #${productId}`);
        } else {
          this.productCache.set(productId, `Sản phẩm #${productId}`);
        }
      });
      
    } catch (error) {
      console.error('Error loading product names:', error);
      // Cache với tên mặc định nếu lỗi
      uncachedProductIds.forEach(id => {
        this.productCache.set(id, `Sản phẩm #${id}`);
      });
    }
  }

  // ✅ Load tên user từ UserService
  private async loadUserNames(userIds: number[]): Promise<void> {
    const uncachedUserIds = userIds.filter(id => !this.userCache.has(id));
    
    if (uncachedUserIds.length === 0) return;

    try {
      // Gọi API để lấy thông tin user
      const userRequests = uncachedUserIds.map(id => 
        this.userService.getUserById(id.toString())
      );
      
      const users = await Promise.all(userRequests.map(req => 
        req.toPromise().catch(() => null)
      ));
      
      // Cache kết quả
      users.forEach((user, index) => {
        const userId = uncachedUserIds[index];
        if (user) {
          this.userCache.set(userId, user.username || `User #${userId}`);
        } else {
          this.userCache.set(userId, `User #${userId}`);
        }
      });
      
    } catch (error) {
      console.error('Error loading user names:', error);
      // Cache với tên mặc định nếu lỗi
      uncachedUserIds.forEach(id => {
        this.userCache.set(id, `User #${id}`);
      });
    }
  }

  searchEvaluates(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  filterByRating(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.evaluates];
    
    // Áp dụng tìm kiếm nếu có
    if (this.searchKeyword) {
      const keyword = this.searchKeyword.toLowerCase();
      result = result.filter(evaluate => 
        evaluate.product_name?.toLowerCase().includes(keyword) || 
        evaluate.user_name?.toLowerCase().includes(keyword) || 
        evaluate.comment.toLowerCase().includes(keyword)
      );
    }
    
    // Áp dụng lọc theo đánh giá
    if (this.filterRating > 0) {
      result = result.filter(evaluate => evaluate.vote === this.filterRating);
    }
    
    this.filteredEvaluates = result;
    this.totalItems = this.filteredEvaluates.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }

  // ✅ Cập nhật method deleteEvaluate để sử dụng ToastService
  deleteEvaluate(id: number): void {
    // Tìm đánh giá để hiển thị thông tin trong confirmation
    const evaluate = this.evaluates.find(e => e.id === id);
    const productName = evaluate?.product_name || `Đánh giá #${id}`;
    const userName = evaluate?.user_name || 'Người dùng không xác định';
    
    // Sử dụng ToastService để hiển thị confirmation
    this.toastService.showConfirmation(
      'Xác nhận xóa đánh giá',
      `Bạn có chắc chắn muốn xóa đánh giá của "${userName}" cho sản phẩm "${productName}"? Hành động này không thể hoàn tác.`,
      () => this.confirmDeleteEvaluate(id),
      () => this.toastService.info('Đã hủy', 'Hành động xóa đánh giá đã được hủy')
    );
  }

  // ✅ Method riêng để xử lý xóa sau khi confirm
  private confirmDeleteEvaluate(id: number): void {
    const evaluate = this.evaluates.find(e => e.id === id);
    
    this.evaluateService.deleteEvaluate(id).subscribe({
      next: (success) => {
        if (success) {
          this.toastService.success(
            'Thành công', 
            `Xóa đánh giá của "${evaluate?.user_name || 'người dùng'}" thành công!`
          );
          
          // Reload data after delete
          this.loadEvaluates();
        } else {
          this.toastService.error('Lỗi', 'Không thể xóa đánh giá này!');
        }
      },
      error: (error) => {
        console.error('Error deleting evaluate:', error);
        
        let errorMessage = 'Đã xảy ra lỗi khi xóa đánh giá!';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.status === 403) {
          errorMessage = 'Bạn không có quyền xóa đánh giá này!';
        } else if (error?.status === 404) {
          errorMessage = 'Đánh giá không tồn tại!';
        }
        
        this.toastService.error('Lỗi', errorMessage);
      }
    });
  }

  // Pagination
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadEvaluates();
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

  get pagedEvaluates(): Evaluate[] {
    // Nếu sử dụng API pagination, return filteredEvaluates trực tiếp
    // Nếu filter client-side, thì cần slice
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredEvaluates.slice(startIndex, startIndex + this.pageSize);
  }

  getRatingStars(vote: number): string {
    return '★'.repeat(vote) + '☆'.repeat(5 - vote);
  }

  getRatingClass(vote: number): string {
    if (vote >= 4) return 'text-success';
    if (vote >= 3) return 'text-warning';
    return 'text-danger';
  }
}