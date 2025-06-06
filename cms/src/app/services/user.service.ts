import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_BASE_URL } from '../constants/api.constants';

export interface Role {
  name: string;
  description: string;
  permissions: any[];
}

// ✅ CẬP NHẬT User interface để support multiple roles
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  profileImage?: string;
  roles?: Role[]; // ✅ Multiple roles
  role?: string; // Keep for backward compatibility
  created_at?: Date;
  updated_at?: Date;
  status?: 'active' | 'inactive' | 'banned';
}

export interface UserListResponse {
  status: number;
  message: string;
  result: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    data: User[];
  };
  timestamp: string;
}

// ✅ THÊM interface cho Role API response
export interface RoleResponse {
  status: number;
  message: string;
  result: Role[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  // Call API thực để lấy danh sách người dùng
  getUsers(pageIndex: number = 1, pageSize: number = 10): Observable<UserListResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<UserListResponse>(`${API_BASE_URL}/identity/users`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return of(this.getMockUsersResponse());
      })
    );
  }

  // Method để UI component sử dụng với interface tương thích
  getUsersForUI(pageIndex: number = 1, pageSize: number = 10): Observable<{
    users: User[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
  }> {
    return this.getUsers(pageIndex, pageSize).pipe(
      map(response => {
        const transformedUsers = response.result.data.map(user => ({
          ...user,
          role: user.roles && user.roles.length > 0 ? user.roles[0].name.toLowerCase() : 'user',
          status: 'active' as const,
          created_at: new Date(),
          updated_at: new Date()
        }));

        return {
          users: transformedUsers,
          totalElements: response.result.totalElements,
          totalPages: response.result.totalPages,
          currentPage: response.result.currentPage
        };
      })
    );
  }

  // Lấy người dùng theo ID
  getUserById(id: string): Observable<User | null> {
    return this.http.get<{
      status: number;
      message: string;
      result: User;
      timestamp: string;
    }>(`${API_BASE_URL}/identity/users/${id}`).pipe(
      map(response => {
        if (response.status === 200) {
          const user = response.result;
          return {
            ...user,
            role: user.roles && user.roles.length > 0 ? user.roles[0].name.toLowerCase() : 'user',
            status: 'active' as const,
            created_at: new Date(),
            updated_at: new Date()
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching user by ID:', error);
        const mockUser = this.mockUsers.find(u => u.id === id);
        return of(mockUser || null);
      })
    );
  }

  // Tạo người dùng mới
  createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Observable<User> {
    const createUserData = {
      username: user.username,
      email: user.email,
      password: user.password,
      profileImage: user.profileImage
    };

    return this.http.post<{
      status: number;
      message: string;
      result: User;
      timestamp: string;
    }>(`${API_BASE_URL}/identity/users`, createUserData).pipe(
      map(response => {
        if (response.status === 200 || response.status === 201) {
          return {
            ...response.result,
            role: response.result.roles && response.result.roles.length > 0 
              ? response.result.roles[0].name.toLowerCase() : 'user',
            status: 'active' as const,
            created_at: new Date(),
            updated_at: new Date()
          };
        }
        throw new Error(response.message || 'Failed to create user');
      }),
      catchError(error => {
        console.error('Error creating user:', error);
        const newUser: User = {
          id: Date.now().toString(),
          ...user,
          profileImage: user.profileImage || 'assets/images/user/avatar-default.jpg',
          role: user.role || 'user',
          status: 'active',
          created_at: new Date(),
          updated_at: new Date()
        };
        this.mockUsers.push(newUser);
        return of(newUser);
      })
    );
  }

  // Cập nhật người dùng
  updateUser(user: Partial<User> & { id: string }): Observable<boolean> {
    const updateUserData = {
      username: user.username,
      email: user.email,
      profileImage: user.profileImage
    };

    if (user.password) {
      Object.assign(updateUserData, { password: user.password });
    }

    return this.http.put<{
      status: number;
      message: string;
      result?: any;
      timestamp: string;
    }>(`${API_BASE_URL}/identity/users/${user.id}`, updateUserData).pipe(
      map(response => response.status === 200),
      catchError(error => {
        console.error('Error updating user:', error);
        const index = this.mockUsers.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.mockUsers[index] = {
            ...this.mockUsers[index],
            ...user,
            updated_at: new Date()
          };
          return of(true);
        }
        return of(false);
      })
    );
  }

  // Xóa người dùng
  deleteUser(id: string): Observable<boolean> {
    return this.http.delete<{
      status: number;
      message: string;
      timestamp: string;
    }>(`${API_BASE_URL}/identity/users/${id}`).pipe(
      map(response => response.status === 200),
      catchError(error => {
        console.error('Error deleting user:', error);
        // Fallback: xóa khỏi mock data
        const initialLength = this.mockUsers.length;
        this.mockUsers = this.mockUsers.filter(u => u.id !== id);
        return of(this.mockUsers.length < initialLength);
      })
    );
  }

  // Kiểm tra username tồn tại
  isUsernameExist(username: string, excludeUserId?: string): Observable<boolean> {
    return this.http.get<{
      status: number;
      message: string;
      result: boolean;
      timestamp: string;
    }>(`${API_BASE_URL}/identity/users/check-username?username=${username}&excludeId=${excludeUserId || ''}`).pipe(
      map(response => response.result),
      catchError(error => {
        console.error('Error checking username:', error);
        const exists = this.mockUsers.some(u => u.username === username && u.id !== excludeUserId);
        return of(exists);
      })
    );
  }

  // Kiểm tra email tồn tại
  isEmailExist(email: string, excludeUserId?: string): Observable<boolean> {
    return this.http.get<{
      status: number;
      message: string;
      result: boolean;
      timestamp: string;
    }>(`${API_BASE_URL}/identity/users/check-email?email=${email}&excludeId=${excludeUserId || ''}`).pipe(
      map(response => response.result),
      catchError(error => {
        console.error('Error checking email:', error);
        const exists = this.mockUsers.some(u => u.email === email && u.id !== excludeUserId);
        return of(exists);
      })
    );
  }

  // ✅ THÊM method để lấy tất cả roles từ API
  getAllRoles(): Observable<Role[]> {
    return this.http.get<RoleResponse>(`${API_BASE_URL}/identity/roles`).pipe(
      map(response => {
        if (response.status === 200) {
          return response.result;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching roles:', error);
        // Fallback roles
        return of([
          {
            name: 'ADMIN',
            description: 'Quyền quản trị viên',
            permissions: []
          },
          {
            name: 'STAFF',
            description: 'Quyền nhân viên',
            permissions: []
          },
          {
            name: 'USER',
            description: 'Quyền người dùng thông thường',
            permissions: []
          }
        ]);
      })
    );
  }

  // ✅ THÊM method để update user roles
  updateUserRoles(userId: string, roleNames: string[]): Observable<boolean> {
    const updateData = {
      roles: roleNames
    };

    return this.http.put<{
      status: number;
      message: string;
      result?: any;
      timestamp: string;
    }>(`${API_BASE_URL}/identity/users/${userId}`, updateData).pipe(
      map(response => response.status === 200),
      catchError(error => {
        console.error('Error updating user roles:', error);
        return of(false);
      })
    );
  }

  // Mock data để fallback khi API không khả dụng
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      profileImage: 'assets/images/user/avatar-1.jpg',
      role: 'admin',
      status: 'active',
      created_at: new Date('2023-01-15'),
      updated_at: new Date('2023-06-20')
    },
    {
      id: '2',
      username: 'user1',
      email: 'user1@example.com',
      profileImage: 'assets/images/user/avatar-2.jpg',
      role: 'user',
      status: 'active',
      created_at: new Date('2023-02-10'),
      updated_at: new Date('2023-06-18')
    },
    {
      id: '3',
      username: 'staff1',
      email: 'staff1@example.com',
      profileImage: 'assets/images/user/avatar-3.jpg',
      role: 'staff',
      status: 'inactive',
      created_at: new Date('2023-03-05'),
      updated_at: new Date('2023-06-15')
    }
  ];

  private getMockUsersResponse(): UserListResponse {
    return {
      status: 200,
      message: 'Mock data for users',
      result: {
        currentPage: 1,
        totalPages: 1,
        totalElements: this.mockUsers.length,
        pageSize: 10,
        data: this.mockUsers
      },
      timestamp: new Date().toISOString()
    };
  }
}