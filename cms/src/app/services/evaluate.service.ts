import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../constants/api.constants';

export interface Evaluate {
  id: number;
  productId: number; // Đổi từ product_id thành productId theo API response
  userId: number; // Thêm userId từ API
  product_name?: string; // Để hiển thị tên sản phẩm trong danh sách (computed)
  user_name?: string; // Tên người đánh giá (computed)
  vote: number;
  comment: string;
  createdAt: string; // Đổi từ created_at thành createdAt theo API response
}

export interface EvaluateListResponse {
  status: number;
  message: string;
  result: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    data: Evaluate[];
  };
  timestamp: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluateService {
  constructor(private http: HttpClient) {}

  // Call API thực để lấy danh sách đánh giá
  getEvaluates(pageIndex: number = 1, pageSize: number = 10): Observable<EvaluateListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<EvaluateListResponse>(`${API_BASE_URL}/product/rate`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching evaluates:', error);
        // Fallback với mock data nếu API lỗi
        return of(this.getMockEvaluatesResponse());
      })
    );
  }

  // Method để UI component sử dụng với interface tương thích
  getEvaluatesForUI(pageIndex: number = 1, pageSize: number = 10): Observable<{
    evaluates: Evaluate[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
  }> {
    return this.getEvaluates(pageIndex, pageSize).pipe(
      map(response => {
        // Transform data để tương thích với UI hiện tại
        const transformedEvaluates = response.result.data.map(evaluate => ({
          ...evaluate,
          // Mapping cho compatibility với UI hiện tại
          product_id: evaluate.productId,
          created_at: new Date(evaluate.createdAt),
          product_name: `Sản phẩm #${evaluate.productId}`, // Tạm thời, có thể call API product để lấy tên thực
          user_name: `User #${evaluate.userId}` // Tạm thời, có thể call API user để lấy tên thực
        }));

        return {
          evaluates: transformedEvaluates,
          totalElements: response.result.totalElements,
          totalPages: response.result.totalPages,
          currentPage: response.result.currentPage
        };
      })
    );
  }

  // Lấy đánh giá theo product ID (có thể cần API riêng)
  getEvaluatesByProductId(productId: number): Observable<Evaluate[]> {
    const params = new HttpParams().set('productId', productId.toString());
    
    return this.http.get<EvaluateListResponse>(`${API_BASE_URL}/product/rate`, { params }).pipe(
      map(response => response.result.data),
      catchError(error => {
        console.error('Error fetching evaluates by product:', error);
        return of(this.mockEvaluates.filter(e => e.productId === productId));
      })
    );
  }

  // Lấy đánh giá theo ID
  getEvaluateById(id: number): Observable<Evaluate | null> {
    return this.http.get<{
      status: number;
      message: string;
      result: Evaluate;
      timestamp: string;
    }>(`${API_BASE_URL}/product/rate/${id}`).pipe(
      map(response => response.status === 200 ? response.result : null),
      catchError(error => {
        console.error('Error fetching evaluate by ID:', error);
        const mockEvaluate = this.mockEvaluates.find(e => e.id === id);
        return of(mockEvaluate || null);
      })
    );
  }

  // Xóa đánh giá
  deleteEvaluate(id: number): Observable<boolean> {
    return this.http.delete<{
      status: number;
      message: string;
      timestamp: string;
    }>(`${API_BASE_URL}/product/rate/${id}`).pipe(
      map(response => response.status === 200),
      catchError(error => {
        console.error('Error deleting evaluate:', error);
        // Fallback: xóa khỏi mock data
        const initialLength = this.mockEvaluates.length;
        this.mockEvaluates = this.mockEvaluates.filter(e => e.id !== id);
        return of(this.mockEvaluates.length < initialLength);
      })
    );
  }

  // Tính điểm đánh giá trung bình cho sản phẩm
  getAverageRating(productId: number): Observable<number> {
    return this.getEvaluatesByProductId(productId).pipe(
      map(evaluates => {
        if (evaluates.length === 0) return 0;
        const sum = evaluates.reduce((total, evaluate) => total + evaluate.vote, 0);
        return sum / evaluates.length;
      })
    );
  }

  // Mock data để fallback khi API không khả dụng
  private mockEvaluates: Evaluate[] = [
    {
      id: 1,
      productId: 1,
      userId: 3,
      product_name: 'Sản phẩm demo',
      user_name: 'Nguyễn Văn A',
      vote: 5,
      comment: 'Sản phẩm rất tốt, chất liệu vải mềm mại, thoáng mát.',
      createdAt: '2023-06-15T10:30:00'
    },
    {
      id: 2,
      productId: 1,
      userId: 4,
      product_name: 'Sản phẩm demo',
      user_name: 'Trần Thị B',
      vote: 4,
      comment: 'Sản phẩm đẹp, nhưng hơi chật so với kích cỡ.',
      createdAt: '2023-06-20T14:15:00'
    },
    {
      id: 3,
      productId: 2,
      userId: 5,
      product_name: 'Sản phẩm khác',
      user_name: 'Lê Văn C',
      vote: 3,
      comment: 'Chất lượng tạm ổn so với giá tiền.',
      createdAt: '2023-07-05T09:20:00'
    }
  ];

  private getMockEvaluatesResponse(): EvaluateListResponse {
    return {
      status: 200,
      message: 'Mock data for evaluates',
      result: {
        currentPage: 1,
        totalPages: 1,
        totalElements: this.mockEvaluates.length,
        pageSize: 10,
        data: this.mockEvaluates
      },
      timestamp: new Date().toISOString()
    };
  }
}