import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../constants/api.constants';

// ✅ Interface cho Blog API response
export interface BlogApiResponse {
  status: number;
  message: string;
  result: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    data: BlogItem[];
  };
  timestamp: string;
}

// ✅ Interface cho Blog item từ API
export interface BlogItem {
  id: number;
  title: string;
  thumbnail: string;
  content: string;
  priority: number;
  categoryId: number;
  slug: string;
  createdAt: string;
}

// ✅ Interface cho Article (UI compatibility)
export interface Article {
  id: string | number;
  category_id?: string | number;
  category_name?: string;
  title: string;
  content: string;
  thumbnail?: string;
  priority: number;
  slug: string;
  created_at: Date;
  updated_at?: Date;
  status?: string;
  author?: string;
}

// ✅ THÊM interface cho Blog Category
export interface BlogCategory {
  id: number;
  name: string;
  priority: number | null;
  parentId: number | null;
  slug: string;
}

export interface BlogCategoryResponse {
  status: number;
  message: string;
  result: BlogCategory[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(private http: HttpClient) {}

  // ✅ Call API thực để lấy danh sách blog
  getBlogs(sortBy: string = 'asc', pageIndex: number = 1, pageSize: number = 10): Observable<BlogApiResponse> {
    const params = new HttpParams()
      .set('sortBy', sortBy)
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<BlogApiResponse>(`${API_BASE_URL}/blog/`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching blogs:', error);
        return of(this.getMockBlogResponse());
      })
    );
  }

  // ✅ Method để UI component sử dụng với interface tương thích
  getBlogsForUI(sortBy: string = 'desc', pageIndex: number = 1, pageSize: number = 10): Observable<{
    articles: Article[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
  }> {
    return this.getBlogs(sortBy, pageIndex, pageSize).pipe(
      map(response => {
        const transformedArticles = response.result.data.map(blog => ({
          id: blog.id.toString(),
          category_id: blog.categoryId?.toString() || '',
          category_name: this.getCategoryName(blog.categoryId),
          title: blog.title,
          content: blog.content,
          thumbnail: blog.thumbnail,
          priority: blog.priority,
          slug: blog.slug,
          created_at: new Date(blog.createdAt),
          updated_at: new Date(blog.createdAt),
          status: 'published',
          author: 'Admin'
        }));

        return {
          articles: transformedArticles,
          totalElements: response.result.totalElements,
          totalPages: response.result.totalPages,
          currentPage: response.result.currentPage
        };
      })
    );
  }

  // ✅ THÊM method để lấy categories cho blog
  getBlogCategories(): Observable<BlogCategory[]> {
    return this.http.get<BlogCategoryResponse>(`${API_BASE_URL}/blog/category`).pipe(
      map(response => {
        if (response.status === 200) {
          return response.result;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching blog categories:', error);
        // Fallback với mock data
        return of([
          {
            id: 1,
            name: 'Tin tức',
            priority: 1,
            parentId: null,
            slug: 'tin-tuc-1'
          },
          {
            id: 2,
            name: 'Review sách',
            priority: 2,
            parentId: null,
            slug: 'review-sach-2'
          },
          {
            id: 3,
            name: 'Khuyến mãi',
            priority: 3,
            parentId: null,
            slug: 'khuyen-mai-3'
          },
          {
            id: 4,
            name: 'Sự kiện',
            priority: 4,
            parentId: null,
            slug: 'su-kien-4'
          }
        ]);
      })
    );
  }

  // ✅ CẬP NHẬT helper để sử dụng dynamic categories
  private getCategoryName(categoryId?: number): string {
    // Tạm thời giữ nguyên logic cũ, sau này có thể optimize
    const categoryMap: { [key: number]: string } = {
      1: 'Tin tức',
      2: 'Review sách',
      3: 'Khuyến mãi',
      4: 'Sự kiện',
    };
    return categoryMap[categoryId || 0] || 'Không xác định';
  }

  // ✅ Mock data để fallback khi API không khả dụng
  private getMockBlogResponse(): BlogApiResponse {
    return {
      status: 200,
      message: "Lấy danh sách blog thành công",
      result: {
        currentPage: 1,
        totalPages: 1,
        totalElements: 1,
        pageSize: 10,
        data: [
          {
            id: 1,
            title: "Hành trình tìm kiếm tri thức",
            thumbnail: "http://localhost:8888/api/v1/file/media/download/d61f2a15-ba0f-4ec1-acb8-86f68a38aa65_vuhailong.jpg",
            content: "Bài viết này chia sẻ những cuốn sách giúp bạn mở rộng hiểu biết và phát triển bản thân.",
            priority: 1,
            categoryId: 4,
            slug: "hnh-trnh-tm-kim-tri-thc-1",
            createdAt: "2025-05-28T23:16:41.730399"
          }
        ]
      },
      timestamp: "2025-05-31T23:04:41.5883752"
    };
  }

  // ✅ Lấy blog theo ID - API: GET /blog/{id}
  getBlogById(id: string): Observable<Article | null> {
    return this.http.get<{
      status: number;
      message: string;
      result: BlogItem;
      timestamp: string;
    }>(`${API_BASE_URL}/blog/${id}`).pipe(
      map(response => {
        if (response.status === 200) {
          const blog = response.result;
          return {
            id: blog.id.toString(),
            category_id: blog.categoryId?.toString() || '',
            category_name: this.getCategoryName(blog.categoryId),
            title: blog.title,
            content: blog.content,
            thumbnail: blog.thumbnail,
            priority: blog.priority,
            slug: blog.slug,
            created_at: new Date(blog.createdAt),
            updated_at: new Date(blog.createdAt),
            status: 'published',
            author: 'Admin'
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching blog by ID:', error);
        return of(null);
      })
    );
  }

  // ✅ Tạo blog mới - API: POST /blog/ (multipart/form-data)
  createBlog(blogData: any, thumbnailFile?: File): Observable<Article> {
    // ✅ Kiểm tra file có tồn tại không
    if (!thumbnailFile) {
      return throwError(() => new Error('Thumbnail file is required'));
    }

    // Tạo FormData
    const formData = new FormData();
    
    // Tạo blog JSON object
    const blogJson = {
      title: blogData.title,
      content: blogData.content,
      priority: blogData.priority,
      categoryId: blogData.categoryId
    };
    
    // ✅ Debug logs
    console.log('=== DEBUG FORM DATA ===');
    console.log('Blog data:', blogJson);
    console.log('Thumbnail file:', {
      name: thumbnailFile.name,
      size: thumbnailFile.size,
      type: thumbnailFile.type,
      lastModified: thumbnailFile.lastModified
    });
    
    // ✅ Thêm blog JSON vào FormData - dùng Blob với correct content type
    const blogBlob = new Blob([JSON.stringify(blogJson)], { 
      type: 'application/json' 
    });
    formData.append('blog', blogBlob);
    
    // ✅ Đảm bảo append file đúng cách
    formData.append('thumbnail', thumbnailFile, thumbnailFile.name);
    
    // ✅ Debug FormData - TypeScript compatible way
    console.log('FormData prepared with:');
    console.log('- Blog JSON blob added');
    console.log('- Thumbnail file added:', thumbnailFile.name);
    console.log('=== END DEBUG ===');

    return this.http.post<{
      status: number;
      message: string;
      result: BlogItem;
      timestamp: string;
    }>(`${API_BASE_URL}/blog/`, formData).pipe(
      map(response => {
        console.log('Success response:', response);
        const blog = response.result;
        return {
          id: blog.id.toString(),
          category_id: blog.categoryId?.toString() || '',
          category_name: this.getCategoryName(blog.categoryId),
          title: blog.title,
          content: blog.content,
          thumbnail: blog.thumbnail,
          priority: blog.priority,
          slug: blog.slug,
          created_at: new Date(blog.createdAt),
          updated_at: new Date(blog.createdAt),
          status: 'published',
          author: 'Admin'
        };
      }),
      catchError(error => {
        console.error('=== CREATE BLOG ERROR ===');
        console.error('Full error:', error);
        console.error('Error status:', error.status);
        console.error('Error body:', error.error);
        console.error('=== END ERROR ===');
        throw error;
      })
    );
  }

  // ✅ Cập nhật blog - API: PUT /blog/{id} (multipart/form-data)
  updateBlog(id: string, blogData: any, thumbnailFile?: File): Observable<Article> {
    // Tạo FormData
    const formData = new FormData();
    
    // Tạo blog JSON object
    const blogJson = {
      title: blogData.title,
      content: blogData.content,
      priority: blogData.priority,
      categoryId: blogData.categoryId
    };
    
    console.log('=== UPDATE BLOG DEBUG ===');
    console.log('Blog data:', blogJson);
    
    // ✅ Thêm blog JSON vào FormData với đúng content type
    const blogBlob = new Blob([JSON.stringify(blogJson)], { 
      type: 'application/json' 
    });
    formData.append('blog', blogBlob);
    
    // Thêm thumbnail file nếu có
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile, thumbnailFile.name);
      console.log('Thumbnail file added:', thumbnailFile.name, thumbnailFile.size);
    } else {
      console.log('No thumbnail file provided for update');
    }
    
    console.log('=== END UPDATE DEBUG ===');

    return this.http.put<{
      status: number;
      message: string;
      result: BlogItem;
      timestamp: string;
    }>(`${API_BASE_URL}/blog/${id}`, formData).pipe(
      map(response => {
        const blog = response.result;
        return {
          id: blog.id.toString(),
          category_id: blog.categoryId?.toString() || '',
          category_name: this.getCategoryName(blog.categoryId),
          title: blog.title,
          content: blog.content,
          thumbnail: blog.thumbnail,
          priority: blog.priority,
          slug: blog.slug,
          created_at: new Date(blog.createdAt),
          updated_at: new Date(blog.createdAt),
          status: 'published',
          author: 'Admin'
        };
      }),
      catchError(error => {
        console.error('Error updating blog:', error);
        throw error;
      })
    );
  }

  // ✅ Xóa blog - API: DELETE /blog/{id}
  deleteBlog(id: string): Observable<boolean> {
    return this.http.delete<{
      status: number;
      message: string;
      timestamp: string;
    }>(`${API_BASE_URL}/blog/${id}`).pipe(
      map(response => response.status === 200),
      catchError(error => {
        console.error('Error deleting blog:', error);
        return of(false);
      })
    );
  }

  // ✅ Tìm kiếm blog
  searchBlogs(keyword: string): Observable<Article[]> {
    const params = new HttpParams()
      .set('search', keyword)
      .set('sortBy', 'desc');

    return this.http.get<BlogApiResponse>(`${API_BASE_URL}/blog/`, { params }).pipe(
      map(response => {
        return response.result.data.map(blog => ({
          id: blog.id.toString(),
          category_id: blog.categoryId?.toString() || '',
          category_name: this.getCategoryName(blog.categoryId),
          title: blog.title,
          content: blog.content,
          thumbnail: blog.thumbnail,
          priority: blog.priority,
          slug: blog.slug,
          created_at: new Date(blog.createdAt),
          updated_at: new Date(blog.createdAt),
          status: 'published',
          author: 'Admin'
        }));
      }),
      catchError(error => {
        console.error('Error searching blogs:', error);
        return of([]);
      })
    );
  }

  // ✅ Generate slug from title
  generateSlug(title: string): string {
    let slug = title.toLowerCase()
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
      
    return slug;
  }

  // ✅ Backward compatibility methods
  getArticles(): Observable<Article[]> {
    return this.getBlogsForUI().pipe(
      map(response => response.articles)
    );
  }

  getArticleById(id: string): Observable<Article | null> {
    return this.getBlogById(id);
  }

  createArticle(articleData: any, thumbnailFile?: File): Observable<Article> {
    return this.createBlog(articleData, thumbnailFile);
  }

  updateArticle(id: string, article: any, thumbnailFile?: File): Observable<Article> {
    return this.updateBlog(id, article, thumbnailFile);
  }

  deleteArticle(id: string): Observable<boolean> {
    return this.deleteBlog(id);
  }

  // ✅ Search articles - hoàn chỉnh method
  searchArticles(keyword: string): Observable<Article[]> {
    return this.searchBlogs(keyword);
  }
}