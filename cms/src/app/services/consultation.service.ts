import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../constants/api.constants';

export interface Consultation {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  content: string;
  created_at?: Date;
  createdAt?: string; // Thêm để tương thích với API response
}

export interface ConsultationListResponse {
  status: number;
  message: string;
  result: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    data: Consultation[];
  };
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  constructor(private http: HttpClient) {}

  // Call API thực để lấy danh sách yêu cầu tư vấn
  getConsultations(sortDir: string = 'desc', pageIndex: number = 1, pageSize: number = 5): Observable<ConsultationListResponse> {
    const params = new HttpParams()
      .set('sortDir', sortDir)
      .set('pageindex', pageIndex.toString()) // Note: API sử dụng 'pageindex' thay vì 'pageIndex'
      .set('pageSize', pageSize.toString());

    return this.http.get<ConsultationListResponse>(`${API_BASE_URL}/customer/`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching consultations:', error);
        // Fallback với mock data nếu API lỗi
        return of(this.getMockConsultationsResponse());
      })
    );
  }

  // Method để UI component sử dụng với interface tương thích
  getConsultationsForUI(sortDir: string = 'desc', pageIndex: number = 1, pageSize: number = 5): Observable<{
    consultations: Consultation[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
  }> {
    return this.getConsultations(sortDir, pageIndex, pageSize).pipe(
      map(response => {
        // Transform data để tương thích với UI hiện tại
        const transformedConsultations = response.result.data.map(consultation => ({
          ...consultation,
          // Mapping cho compatibility với UI hiện tại
          created_at: consultation.createdAt ? new Date(consultation.createdAt) : new Date()
        }));

        return {
          consultations: transformedConsultations,
          totalElements: response.result.totalElements,
          totalPages: response.result.totalPages,
          currentPage: response.result.currentPage
        };
      })
    );
  }

  // Lấy chi tiết một yêu cầu tư vấn theo ID
  getConsultationById(id: number): Observable<Consultation | null> {
    return this.http.get<{
      status: number;
      message: string;
      result: Consultation;
      timestamp: string;
    }>(`${API_BASE_URL}/customer/${id}`).pipe(
      map(response => {
        if (response.status === 200) {
          const consultation = response.result;
          return {
            ...consultation,
            created_at: consultation.createdAt ? new Date(consultation.createdAt) : new Date()
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching consultation by ID:', error);
        // Fallback với mock data
        const mockConsultation = this.mockConsultations.find(c => c.id === id);
        return of(mockConsultation || null);
      })
    );
  }

  // Xóa yêu cầu tư vấn
  deleteConsultation(id: number): Observable<boolean> {
    return this.http.delete<{
      status: number;
      message: string;
      timestamp: string;
    }>(`${API_BASE_URL}/customer/${id}`).pipe(
      map(response => response.status === 200),
      catchError(error => {
        console.error('Error deleting consultation:', error);
        // Fallback: xóa khỏi mock data
        const initialLength = this.mockConsultations.length;
        this.mockConsultations = this.mockConsultations.filter(c => c.id !== id);
        return of(this.mockConsultations.length < initialLength);
      })
    );
  }

  // Mock data để fallback khi API không khả dụng
  private mockConsultations: Consultation[] = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      email: 'nguyenvana@example.com',
      address: '123 Đường ABC, Quận XYZ, TP. Hà Nội',
      content: 'Tôi cần hỗ trợ về đơn hàng đã đặt.',
      created_at: new Date('2023-08-10 10:30:00')
    },
    {
      id: 2,
      name: 'Trần Thị B',
      phone: '0912345678',
      email: 'tranthib@example.com',
      address: '456 Đường DEF, Quận UVW, TP. HCM',
      content: 'Tôi cần tư vấn về chính sách đổi trả sách.',
      created_at: new Date('2023-08-12 14:30:00')
    },
    {
      id: 3,
      name: 'Lê Văn C',
      phone: '0969696969',
      email: 'levanc@example.com',
      address: 'Số 78, Đường Trần Hưng Đạo, Q.5, TP.HCM',
      content: 'Tôi muốn được tư vấn về các loại sách phù hợp cho học sinh lớp 3.',
      created_at: new Date('2023-08-15 16:45:00')
    }
  ];

  private getMockConsultationsResponse(): ConsultationListResponse {
    return {
      status: 200,
      message: 'Mock data for consultations',
      result: {
        currentPage: 1,
        totalPages: 1,
        totalElements: this.mockConsultations.length,
        pageSize: 5,
        data: this.mockConsultations
      },
      timestamp: new Date().toISOString()
    };
  }
}