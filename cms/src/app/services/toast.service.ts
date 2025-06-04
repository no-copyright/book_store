import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirmation';
  duration?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts = this.toastsSubject.asObservable();

  constructor() {}

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  show(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000) {
    const toast: Toast = {
      id: this.generateId(),
      title,
      message,
      type,
      duration
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  success(title: string, message: string, duration: number = 3000) {
    this.show(title, message, 'success', duration);
  }

  error(title: string, message: string, duration: number = 5000) {
    this.show(title, message, 'error', duration);
  }

  warning(title: string, message: string, duration: number = 4000) {
    this.show(title, message, 'warning', duration);
  }

  info(title: string, message: string, duration: number = 3000) {
    this.show(title, message, 'info', duration);
  }

  showConfirmation(title: string, message: string, onConfirm: () => void, onCancel?: () => void) {
    const toast: Toast = {
      id: this.generateId(),
      title,
      message,
      type: 'confirmation',
      onConfirm,
      onCancel
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);
  }

  remove(id: string) {
    const currentToasts = this.toastsSubject.value;
    const updatedToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(updatedToasts);
  }

  confirm(id: string) {
    const currentToasts = this.toastsSubject.value;
    const toast = currentToasts.find(t => t.id === id);
    
    if (toast && toast.onConfirm) {
      toast.onConfirm();
    }
    
    this.remove(id);
  }

  cancel(id: string) {
    const currentToasts = this.toastsSubject.value;
    const toast = currentToasts.find(t => t.id === id);
    
    if (toast && toast.onCancel) {
      toast.onCancel();
    }
    
    this.remove(id);
  }

  clear() {
    this.toastsSubject.next([]);
  }

  getToasts() {
    return this.toastsSubject.value;
  }

  // Legacy methods for backward compatibility
  showSuccess(message: string, delay: number = 3000) {
    this.success('Thành công', message, delay);
  }

  showError(message: string, delay: number = 5000) {
    this.error('Lỗi', message, delay);
  }

  showWarning(message: string, delay: number = 4000) {
    this.warning('Cảnh báo', message, delay);
  }

  showInfo(message: string, delay: number = 3000) {
    this.info('Thông báo', message, delay);
  }
}