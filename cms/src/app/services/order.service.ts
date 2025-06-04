import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../constants/api.constants';

// ✅ Interface cho API response
export interface OrderApiResponse {
  status: number;
  message: string;
  result: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    data: OrderApiItem[];
  };
  timestamp: string;
}

// ✅ Interface cho Order item từ API - CẬP NHẬT với thumbnail
export interface OrderApiItem {
  id: number;
  userId: number;
  profileId: number;
  fullName: string;
  phone: string;
  address: string;
  status: number; // 0: giao hàng thành công, 1: chờ xác nhận, 2: chờ đơn vị vận chuyển, 3: đang vận chuyển, 4: đã giao, 5: đã huỷ
  paymentMethod: number; // 0: cod, 1: bank_transfer, 2: momo, 3: zalopay
  paymentStatus: number; // 0: đã thanh toán, 1: chưa thanh toán, 2: đã hoàn tiền, 3: không thành công, 5: đã huỷ
  totalPrice: number;
  note: string;
  createdAt: string;
  orderProducts: OrderProductItem[];
}

// ✅ Interface cho Order product item từ API - CẬP NHẬT với thumbnail
export interface OrderProductItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  thumbnail: string; // ✅ ĐÃ CÓ thumbnail từ API
}

// ✅ Interface cho OrderItem (UI format)
export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  total: number;
}

// ✅ Interface cho UI (compatibility với code hiện tại)
export interface Order {
  id: string;
  user_id: string;
  profile_id: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  order_date: Date;
  status: 'delivered' | 'pending' | 'waiting_carrier' | 'shipping' | 'completed' | 'canceled';
  payment_method: 'cod' | 'bank_transfer' | 'momo' | 'zalopay';
  payment_status: 'paid' | 'pending' | 'refunded' | 'failed' | 'canceled';
  note?: string;
  total_amount: number;
  items: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  // ✅ Call API thực để lấy danh sách đơn hàng
  getOrdersFromAPI(pageIndex: number = 1, pageSize: number = 10): Observable<OrderApiResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<OrderApiResponse>(`${API_BASE_URL}/order/`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching orders:', error);
        return of(this.getMockOrderResponse());
      })
    );
  }

  // ✅ Transform order từ API format sang UI format - ĐƠN GIẢN HÓA
  private transformOrderFromAPI(apiOrder: OrderApiItem): Order {
    return {
      id: apiOrder.id.toString(),
      user_id: apiOrder.userId.toString(),
      profile_id: apiOrder.profileId.toString(),
      customer_name: apiOrder.fullName,
      phone: apiOrder.phone,
      email: `user${apiOrder.userId}@example.com`,
      address: apiOrder.address,
      order_date: new Date(apiOrder.createdAt),
      status: this.mapOrderStatus(apiOrder.status),
      payment_method: this.mapPaymentMethod(apiOrder.paymentMethod),
      payment_status: this.mapPaymentStatus(apiOrder.paymentStatus),
      note: apiOrder.note,
      total_amount: apiOrder.totalPrice,
      items: apiOrder.orderProducts.map(product => ({
        id: product.id.toString(),
        product_id: product.productId.toString(),
        product_name: product.productName,
        product_image: product.thumbnail || this.getDefaultProductImage(), // ✅ Sử dụng thumbnail từ API
        price: product.price,
        quantity: product.quantity,
        total: product.price * product.quantity
      }))
    };
  }

  // ✅ Method để UI component sử dụng với interface tương thích - ĐƠN GIẢN HÓA
  getOrdersForUI(pageIndex: number = 1, pageSize: number = 10): Observable<{
    orders: Order[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
  }> {
    return this.getOrdersFromAPI(pageIndex, pageSize).pipe(
      map(response => {
        // ✅ Transform trực tiếp không cần forkJoin
        const transformedOrders = response.result.data.map(order => this.transformOrderFromAPI(order));

        return {
          orders: transformedOrders,
          totalElements: response.result.totalElements,
          totalPages: response.result.totalPages,
          currentPage: response.result.currentPage
        };
      })
    );
  }

  // ✅ Lấy đơn hàng theo ID từ API - ĐƠN GIẢN HÓA
  getOrderByIdFromAPI(id: string): Observable<Order | null> {
    return this.http.get<{
      status: number;
      message: string;
      result: OrderApiItem;
      timestamp: string;
    }>(`${API_BASE_URL}/order/${id}`).pipe(
      map(response => {
        if (response.status === 200) {
          // ✅ Transform trực tiếp
          return this.transformOrderFromAPI(response.result);
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching order by ID:', error);
        return of(null);
      })
    );
  }

  // ✅ Default product image method
  private getDefaultProductImage(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04NS4zMzMzIDY2LjY2NjdIMTE0LjY2N1Y4MC4wMDAxSDEyOFY5My4zMzM0SDExNC42NjdWMTA2LjY2N0g4NS4zMzMzVjkzLjMzMzRINzJWODAuMDAwMUg4NS4zMzMzVjY2LjY2NjdaIiBmaWxsPSIjOUNBM0FGII8+CjxwYXRoIGQ9Ik04NSAyOEM4NSAyNi44OTU0IDg1Ljg5NTQgMjYgODcgMjZIMTEzQzExNC4xMDUgMjYgMTE1IDI2Ljg5NTQgMTE1IDI4VjQwSDg1VjI4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
  }

  // ✅ Map order status từ number sang string - THEO YÊU CẦU MỚI
  private mapOrderStatus(status: number): 'delivered' | 'pending' | 'waiting_carrier' | 'shipping' | 'completed' | 'canceled' {
    switch (status) {
      case 0: return 'delivered'; // giao hàng thành công
      case 1: return 'pending'; // chờ xác nhận
      case 2: return 'waiting_carrier'; // chờ đơn vị vận chuyển
      case 3: return 'shipping'; // đang vận chuyển
      case 4: return 'completed'; // đã giao
      case 5: return 'canceled'; // đã huỷ
      default: return 'pending';
    }
  }

  // ✅ Map payment method từ number sang string
  private mapPaymentMethod(method: number): 'cod' | 'bank_transfer' | 'momo' | 'zalopay' {
    switch (method) {
      case 0: return 'cod';
      case 1: return 'bank_transfer';
      case 2: return 'momo';
      case 3: return 'zalopay';
      default: return 'cod';
    }
  }

  // ✅ Map payment status từ number sang string - THEO YÊU CẦU MỚI
  private mapPaymentStatus(status: number): 'paid' | 'pending' | 'refunded' | 'failed' | 'canceled' {
    switch (status) {
      case 0: return 'paid'; // đã thanh toán
      case 1: return 'pending'; // chưa thanh toán
      case 2: return 'refunded'; // đã hoàn tiền
      case 3: return 'failed'; // không thành công
      case 5: return 'canceled'; // đã huỷ
      default: return 'pending';
    }
  }

  // ✅ Lấy đơn hàng theo ID từ API
  getOrderById(id: string): Observable<Order | null> {
    return this.getOrderByIdFromAPI(id);
  }

  // ✅ Cập nhật trạng thái đơn hàng - CHỈ GỬI status và note
  updateOrderStatusAPI(id: string, status: string, paymentStatus: string, note?: string): Observable<boolean> {
    const statusNumber = this.mapStatusToNumber(status);

    const updateData = {
      status: statusNumber,
      note: note || ''
    };

    return this.http.patch<{
      status: number;
      message: string;
      timestamp: string;
    }>(`${API_BASE_URL}/order/${id}`, updateData).pipe(
      map(response => response.status === 200),
      catchError(error => {
        console.error('Error updating order status:', error);
        return of(false);
      })
    );
  }

  // ✅ Helper methods để map từ string sang number - CẬP NHẬT
  private mapStatusToNumber(status: string): number {
    switch (status) {
      case 'delivered': return 0;
      case 'pending': return 1;
      case 'waiting_carrier': return 2;
      case 'shipping': return 3;
      case 'completed': return 4;
      case 'canceled': return 5;
      default: return 1;
    }
  }

  // ✅ Mock data để fallback khi API không khả dụng - CẬP NHẬT với thumbnail
  private getMockOrderResponse(): OrderApiResponse {
    return {
      status: 200,
      message: "Lấy danh sách đơn hàng thành công",
      result: {
        currentPage: 1,
        totalPages: 1,
        totalElements: 3,
        pageSize: 10,
        data: [
          {
            id: 1,
            userId: 3,
            profileId: 1,
            fullName: "Nguyễn Duy Đạt",
            phone: "0986964761",
            address: "Thanh Oai Hà Nội",
            status: 2, // chờ đơn vị vận chuyển
            paymentMethod: 0, // cod
            paymentStatus: 1, // chưa thanh toán
            totalPrice: 400000,
            note: "Test",
            createdAt: "2025-05-28T22:27:21.564307",
            orderProducts: [
              {
                id: 1,
                productId: 1,
                productName: "Học Lập Trình javascript Nâng Cao",
                price: 400000,
                quantity: 1,
                thumbnail: "http://localhost:8888/api/v1/file/media/download/default.img"
              }
            ]
          },
          {
            id: 2,
            userId: 2,
            profileId: 2,
            fullName: "Trần Thị B",
            phone: "0907654321",
            address: "456 Đường XYZ, Quận 2, TP. HCM",
            status: 1, // chờ xác nhận
            paymentMethod: 1, // bank_transfer
            paymentStatus: 1, // chưa thanh toán
            totalPrice: 180000,
            note: "",
            createdAt: "2023-05-16T14:20:00",
            orderProducts: [
              {
                id: 3,
                productId: 3,
                productName: "Tư duy nhanh và chậm",
                price: 120000,
                quantity: 1,
                thumbnail: "http://localhost:8888/api/v1/file/media/download/default.img"
              },
              {
                id: 4,
                productId: 4,
                productName: "Atomic Habits",
                price: 60000,
                quantity: 1,
                thumbnail: "http://localhost:8888/api/v1/file/media/download/default.img"
              }
            ]
          },
          {
            id: 3,
            userId: 3,
            profileId: 3,
            fullName: "Lê Văn C",
            phone: "0909876543",
            address: "789 Đường ABC, Quận 3, TP. HCM",
            status: 3, // đang vận chuyển
            paymentMethod: 2, // momo
            paymentStatus: 0, // đã thanh toán
            totalPrice: 320000,
            note: "Gọi trước khi giao",
            createdAt: "2023-05-17T09:15:00",
            orderProducts: [
              {
                id: 5,
                productId: 5,
                productName: "Think and Grow Rich",
                price: 160000,
                quantity: 2,
                thumbnail: "http://localhost:8888/api/v1/file/media/download/default.img"
              }
            ]
          }
        ]
      },
      timestamp: "2025-06-03T22:35:17.4739936"
    };
  }

  // ✅ Backward compatibility methods (sử dụng API thực)
  getOrders(): Observable<Order[]> {
    return this.getOrdersForUI().pipe(
      map(response => response.orders)
    );
  }

  updateOrderStatus(id: string, status: string, payment_status: string, note?: string): Observable<boolean> {
    return this.updateOrderStatusAPI(id, status, payment_status, note);
  }
}