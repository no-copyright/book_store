import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CategoryService, Category } from 'src/app/services/category.service';
import { ToastService } from 'src/app/services/toast.service'; // ✅ Import ToastService

@Component({
  selector: 'app-list-category',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.scss'
})
export class ListCategoryComponent implements OnInit {
  allCategories: Category[] = [];
  flatCategories: Category[] = [];
  hierarchicalCategories: Category[] = [];
  searchKeyword: string = '';
  viewMode: 'flat' | 'hierarchical' = 'hierarchical';
  loading: boolean = false; // ✅ Thêm loading state
  
  // Phân trang
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  Math = Math;

  // ✅ THAY ĐỔI type thành Set<string> để tương thích với cả string và number
  expandedItems: Set<string> = new Set();

  constructor(
    private router: Router, 
    private categoryService: CategoryService,
    private toastService: ToastService // ✅ Inject ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    // ✅ Mở rộng các danh mục gốc mặc định
    this.expandRootCategories();
  }

  loadCategories(): void {
    this.loading = true;
    
    // Lấy tất cả danh mục
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.allCategories = data;
        this.prepareCategories();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        
        // Hiển thị thông báo lỗi chi tiết
        if (error.status === 401) {
          this.toastService.warning('Cảnh báo', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (error.status === 0) {
          this.toastService.error('Lỗi kết nối', 'Không thể kết nối đến server. Đang sử dụng dữ liệu mẫu.');
        } else {
          this.toastService.error('Lỗi', 'Có lỗi xảy ra khi tải danh sách danh mục');
        }
        
        this.loading = false;
      }
    });
    
    // Lấy danh mục phân cấp
    this.categoryService.getCategoriesHierarchy().subscribe({
      next: (data) => {
        this.hierarchicalCategories = data;
      },
      error: (error) => {
        console.error('Error loading hierarchical categories:', error);
      }
    });
  }

  // Chuẩn bị dữ liệu hiển thị
  prepareCategories(): void {
    // Sắp xếp theo level, sau đó theo priority
    this.flatCategories = [...this.allCategories].sort((a, b) => {
      if ((a.level || 0) !== (b.level || 0)) {
        return (a.level || 0) - (b.level || 0);
      }
      return a.priority - b.priority;
    });
    
    this.totalItems = this.flatCategories.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }

  searchCategories(): void {
    if (!this.searchKeyword.trim()) {
      this.prepareCategories();
      return;
    }

    // Tìm kiếm trong tất cả danh mục
    const filtered = this.allCategories.filter(category => 
      category.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
      category.slug.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
    
    // Hiển thị kết quả dưới dạng phẳng
    this.flatCategories = filtered.sort((a, b) => (a.level || 0) - (b.level || 0));
    this.viewMode = 'flat'; // Chuyển sang chế độ hiển thị phẳng để hiển thị kết quả tìm kiếm
    
    this.totalItems = this.flatCategories.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);

    // Hiển thị thông báo kết quả tìm kiếm
    if (this.flatCategories.length === 0) {
      this.toastService.info('Tìm kiếm', `Không tìm thấy danh mục nào với từ khóa "${this.searchKeyword}"`);
    } else {
      this.toastService.success('Tìm kiếm', `Tìm thấy ${this.flatCategories.length} danh mục với từ khóa "${this.searchKeyword}"`);
    }
  }

  navigateToAddCategory(): void {
    this.router.navigate(['/category/add-category']);
  }

  navigateToEditCategory(id: string | number): void {
    console.log('Navigating to edit category with ID:', id);
    this.router.navigate(['/category/edit-category', id]);
  }

  // ✅ Cập nhật deleteCategory để sử dụng ToastService
  deleteCategory(id: string | number): void {
    // Tìm category để hiển thị thông tin trong confirmation
    const category = this.allCategories.find(c => c.id.toString() === id.toString());
    const categoryName = category?.name || `Danh mục #${id}`;
    
    // Kiểm tra xem danh mục có danh mục con không
    const hasChildren = this.allCategories.some(c => 
      c.parent_id?.toString() === id.toString() || c.parentId?.toString() === id.toString()
    );
    
    if (hasChildren) {
      this.toastService.warning('Cảnh báo', 'Không thể xóa danh mục này vì có chứa danh mục con!');
      return;
    }
    
    // Sử dụng ToastService để hiển thị confirmation
    this.toastService.showConfirmation(
      'Xác nhận xóa danh mục',
      `Bạn có chắc chắn muốn xóa danh mục "${categoryName}"? Hành động này không thể hoàn tác.`,
      () => this.confirmDeleteCategory(id),
      () => this.toastService.info('Đã hủy', 'Hành động xóa danh mục đã được hủy')
    );
  }

  // ✅ Method riêng để xử lý xóa sau khi confirm
  private confirmDeleteCategory(id: string | number): void {
    const category = this.allCategories.find(c => c.id.toString() === id.toString());
    
    this.categoryService.deleteCategory(id.toString()).subscribe({
      next: (success) => {
        if (success) {
          this.toastService.success(
            'Thành công', 
            `Xóa danh mục "${category?.name || 'danh mục'}" thành công!`
          );
          
          // Reload data after delete
          this.loadCategories();
        } else {
          this.toastService.error('Lỗi', 'Không thể xóa danh mục này!');
        }
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        
        let errorMessage = 'Đã xảy ra lỗi khi xóa danh mục!';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.status === 403) {
          errorMessage = 'Bạn không có quyền xóa danh mục này!';
        } else if (error?.status === 404) {
          errorMessage = 'Danh mục không tồn tại!';
        } else if (error?.status === 400) {
          errorMessage = 'Không thể xóa danh mục có chứa danh mục con!';
        }
        
        this.toastService.error('Lỗi', errorMessage);
      }
    });
  }

  switchViewMode(mode: 'flat' | 'hierarchical'): void {
    this.viewMode = mode;
  }

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
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get pagedCategories(): Category[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.flatCategories.slice(startIndex, startIndex + this.pageSize);
  }

  // Lấy tên danh mục cha từ id
  getParentCategoryName(parentId?: string | number | null): string {
    if (!parentId) return '';
    
    const parent = this.allCategories.find(c => 
      c.id.toString() === parentId.toString()
    );
    return parent ? parent.name : '';
  }

  // Tạo indent (thụt lề) dựa trên level
  getIndent(level: number = 0): string {
    return '•'.repeat(level) + (level > 0 ? ' ' : '');
  }

  // ✅ Thêm method để hiển thị type
  getTypeText(type?: string): string {
    switch (type) {
      case 'BLOG': return 'Blog';
      case 'PRODUCT': return 'Sản phẩm';
      default: return type || 'Không xác định';
    }
  }

  getTypeClass(type?: string): string {
    switch (type) {
      case 'BLOG': return 'bg-info';
      case 'PRODUCT': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  // ✅ SỬA methods cho expand/collapse
  isExpanded(categoryId: number | string): boolean {
    return this.expandedItems.has(categoryId.toString());
  }

  toggleExpand(categoryId: number | string): void {
    const id = categoryId.toString();
    if (this.expandedItems.has(id)) {
      this.expandedItems.delete(id);
    } else {
      this.expandedItems.add(id);
    }
  }

  hasChildren(category: Category): boolean {
    return category.children && category.children.length > 0;
  }

  expandAll(): void {
    this.expandedItems.clear();
    this.addAllCategoryIds(this.hierarchicalCategories);
  }

  collapseAll(): void {
    this.expandedItems.clear();
  }

  expandRootCategories(): void {
    // Mở rộng các danh mục gốc mặc định
    this.hierarchicalCategories.forEach(category => {
      if (this.hasChildren(category)) {
        this.expandedItems.add(category.id.toString());
      }
    });
  }

  private addAllCategoryIds(categories: Category[]): void {
    categories.forEach(category => {
      if (this.hasChildren(category)) {
        this.expandedItems.add(category.id.toString());
        this.addAllCategoryIds(category.children!);
      }
    });
  }

  trackByCategory(index: number, category: Category): string | number {
    return category.id;
  }
}