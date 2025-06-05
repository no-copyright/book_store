import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ArticleService, Article, BlogCategory } from 'src/app/services/article.service'; // ✅ Import BlogCategory
import { ToastService } from 'src/app/services/toast.service';
import { forkJoin } from 'rxjs'; // ✅ Import forkJoin để gọi cùng lúc nhiều API

@Component({
  selector: 'app-list-article',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './list-article.component.html',
  styleUrl: './list-article.component.scss'
})
export class ListArticleComponent implements OnInit {
  articles: Article[] = [];
  categories: BlogCategory[] = []; // ✅ Thay đổi type
  loading: boolean = false;
  searchKeyword: string = '';
  Math = Math;
  
  // Phân trang
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;

  constructor(
    private router: Router, 
    private articleService: ArticleService,
    private toastService: ToastService
    // ✅ XÓA CategoryService injection
    // private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // ✅ CẬP NHẬT loadData để sử dụng blog categories
  loadData(): void {
    this.loading = true;
    
    // Gọi cả hai API cùng lúc
    forkJoin({
      articles: this.articleService.getBlogsForUI('desc', this.currentPage, this.pageSize),
      categories: this.articleService.getBlogCategories() // ✅ Sử dụng getBlogCategories
    }).subscribe({
      next: (response) => {
        // Set categories trước
        this.categories = response.categories;
        
        // Set articles và map category names
        this.articles = this.mapCategoryNamesToArticles(response.articles.articles);
        this.totalItems = response.articles.totalElements;
        this.totalPages = response.articles.totalPages;
        this.currentPage = response.articles.currentPage;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.handleLoadError(error);
        this.loading = false;
      }
    });
  }

  // ✅ Load articles only (for pagination)
  loadArticles(): void {
    this.loading = true;
    this.articleService.getBlogsForUI('desc', this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.articles = this.mapCategoryNamesToArticles(response.articles);
        this.totalItems = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage;
        this.loading = false;
        
        console.log('Loaded articles:', this.articles);
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.handleLoadError(error);
        this.loading = false;
      }
    });
  }

  // ✅ CẬP NHẬT mapCategoryNamesToArticles để sử dụng BlogCategory
  private mapCategoryNamesToArticles(articles: Article[]): Article[] {
    return articles.map(article => ({
      ...article,
      category_name: this.getCategoryNameById(article.category_id)
    }));
  }

  // ✅ CẬP NHẬT getCategoryNameById để sử dụng BlogCategory
  getCategoryNameById(categoryId?: string | number): string {
    if (!categoryId || !this.categories) return 'Không xác định';
    
    const category = this.categories.find(cat => 
      cat.id.toString() === categoryId.toString()
    );
    
    return category ? category.name : 'Không xác định';
  }

  // ✅ Tìm kiếm articles
  searchArticles(): void {
    if (!this.searchKeyword.trim()) {
      this.loadArticles();
      return;
    }

    this.loading = true;
    this.articleService.searchBlogs(this.searchKeyword).subscribe({
      next: (articles) => {
        this.articles = this.mapCategoryNamesToArticles(articles);
        this.totalItems = articles.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.currentPage = 1;
        this.loading = false;

        if (articles.length === 0) {
          this.toastService.info('Tìm kiếm', `Không tìm thấy bài viết nào với từ khóa "${this.searchKeyword}"`);
        } else {
          this.toastService.success('Tìm kiếm', `Tìm thấy ${articles.length} bài viết với từ khóa "${this.searchKeyword}"`);
        }
      },
      error: (error) => {
        console.error('Error searching articles:', error);
        this.toastService.error('Lỗi', 'Có lỗi xảy ra khi tìm kiếm bài viết');
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
      this.toastService.error('Lỗi', 'Có lỗi xảy ra khi tải danh sách bài viết');
    }
  }

  // ✅ Refresh data
  refreshData(): void {
    this.searchKeyword = '';
    this.loadData(); // ✅ Load cả categories và articles
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'published': return 'bg-success';
      case 'draft': return 'bg-warning';
      case 'archived': return 'bg-secondary';
      default: return 'bg-info';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'published': return 'Đã xuất bản';
      case 'draft': return 'Nháp';
      case 'archived': return 'Đã lưu trữ';
      default: return 'Không xác định';
    }
  }

  navigateToAddArticle(): void {
    this.router.navigate(['/article/add-article']); // ✅ Sửa route đúng
  }

  navigateToEditArticle(id: string): void {
    this.router.navigate(['/article/edit-article', id]); // ✅ Sửa route đúng
  }

  deleteArticle(id: string): void {
    const article = this.articles.find(a => a.id.toString() === id);
    const articleTitle = article?.title || `Bài viết #${id}`;
    
    this.toastService.showConfirmation(
      'Xác nhận xóa bài viết',
      `Bạn có chắc chắn muốn xóa bài viết "${articleTitle}"? Hành động này không thể hoàn tác.`,
      () => this.confirmDeleteArticle(id),
      () => this.toastService.info('Đã hủy', 'Hành động xóa bài viết đã được hủy')
    );
  }

  private confirmDeleteArticle(id: string): void {
    const article = this.articles.find(a => a.id.toString() === id);
    
    this.articleService.deleteBlog(id).subscribe({
      next: (success) => {
        if (success) {
          this.toastService.success(
            'Thành công', 
            `Xóa bài viết "${article?.title || 'bài viết'}" thành công!`
          );
          this.loadArticles(); // Reload data after delete
        } else {
          this.toastService.error('Lỗi', 'Không thể xóa bài viết này!');
        }
      },
      error: (error) => {
        console.error('Error deleting article:', error);
        let errorMessage = 'Đã xảy ra lỗi khi xóa bài viết!';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.status === 403) {
          errorMessage = 'Bạn không có quyền xóa bài viết này!';
        } else if (error?.status === 404) {
          errorMessage = 'Bài viết không tồn tại!';
        }
        
        this.toastService.error('Lỗi', errorMessage);
      }
    });
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
      this.loadArticles(); // Load data cho trang mới
    }
  }

  // Rút gọn nội dung
  truncateContent(content: string, maxLength: number = 50): string {
    if (!content) return '';
    
    // Remove HTML tags
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(content, 'text/html');
    const text = htmlDoc.body.textContent || '';
    
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // ✅ Format date
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  // ✅ Get safe image source
  getArticleImageSrc(article: Article): string {
    if (article.thumbnail && article.thumbnail !== 'null' && article.thumbnail.trim() !== '') {
      return article.thumbnail;
    }
    return 'assets/images/gallery/img-gal-1.jpg'; // Fallback image
  }

  // ✅ Handle image error
  onImageError(event: any): void {
    event.target.src = 'assets/images/gallery/img-gal-1.jpg';
  }
}