import { Injectable } from '@angular/core';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface StepValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

@Injectable({
  providedIn: 'root',
})
export class TripValidationService {
  /**
   * Validate Step 1: Thời gian & Ngân sách
   */
  validateStep1(data: {
    startDate: string;
    endDate: string;
    arriveTime: string;
    leaveTime: string;
    budgetTier: number;
  }): StepValidationResult {
    const errors: ValidationError[] = [];

    // Kiểm tra ngày bắt đầu
    if (!data.startDate) {
      errors.push({
        field: 'startDate',
        message: 'Vui lòng chọn ngày bắt đầu',
        severity: 'error',
      });
    }

    // Kiểm tra ngày kết thúc
    if (!data.endDate) {
      errors.push({
        field: 'endDate',
        message: 'Vui lòng chọn ngày kết thúc',
        severity: 'error',
      });
    }

    // Kiểm tra ngày hợp lệ
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Ngày bắt đầu không được trong quá khứ
      if (start < today) {
        errors.push({
          field: 'startDate',
          message: 'Ngày bắt đầu không được trong quá khứ',
          severity: 'error',
        });
      }

      // Ngày kết thúc phải sau ngày bắt đầu
      if (end <= start) {
        errors.push({
          field: 'endDate',
          message: 'Ngày kết thúc phải sau ngày bắt đầu',
          severity: 'error',
        });
      }

      // Cảnh báo nếu trip quá dài (> 30 ngày)
      const daysDiff = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 3600 * 24),
      );
      if (daysDiff > 30) {
        errors.push({
          field: 'endDate',
          message: 'Chuyến đi dài hơn 30 ngày có thể khó lên kế hoạch',
          severity: 'warning',
        });
      }
    }

    // Kiểm tra giờ
    if (!data.arriveTime) {
      errors.push({
        field: 'arriveTime',
        message: 'Vui lòng chọn giờ đến',
        severity: 'error',
      });
    }

    if (!data.leaveTime) {
      errors.push({
        field: 'leaveTime',
        message: 'Vui lòng chọn giờ rời đi',
        severity: 'error',
      });
    }

    // Kiểm tra ngân sách
    if (!data.budgetTier || data.budgetTier < 1 || data.budgetTier > 3) {
      errors.push({
        field: 'budgetTier',
        message: 'Vui lòng chọn mức ngân sách hợp lệ',
        severity: 'error',
      });
    }

    return {
      isValid: errors.filter((e) => e.severity === 'error').length === 0,
      errors,
    };
  }

  /**
   * Validate Step 2: Sở thích & Điểm nhấn
   */
  validateStep2(data: {
    tags: string[];
    members: number;
    hasElderlyOrKids: boolean;
  }): StepValidationResult {
    const errors: ValidationError[] = [];

    // Kiểm tra phong cách
    if (!data.tags || data.tags.length === 0) {
      errors.push({
        field: 'tags',
        message: 'Vui lòng chọn ít nhất 1 phong cách du lịch',
        severity: 'error',
      });
    }

    if (data.tags && data.tags.length > 3) {
      errors.push({
        field: 'tags',
        message: 'Chỉ được chọn tối đa 3 phong cách',
        severity: 'error',
      });
    }

    // Kiểm tra số thành viên
    if (!data.members || data.members < 1) {
      errors.push({
        field: 'members',
        message: 'Số thành viên phải ít nhất là 1',
        severity: 'error',
      });
    }

    if (data.members > 20) {
      errors.push({
        field: 'members',
        message: 'Số thành viên không được vượt quá 20 người',
        severity: 'warning',
      });
    }

    return {
      isValid: errors.filter((e) => e.severity === 'error').length === 0,
      errors,
    };
  }

  /**
   * Validate Step 3: Chi tiết & Yêu cầu
   */
  validateStep3(data: {
    accommodation: string;
    pace: string;
    mustVisitPlaces: string;
  }): StepValidationResult {
    const errors: ValidationError[] = [];

    // Kiểm tra tốc độ du lịch
    const validPaces = ['slow', 'medium', 'fast'];
    if (!data.pace || !validPaces.includes(data.pace)) {
      errors.push({
        field: 'pace',
        message: 'Vui lòng chọn tốc độ du lịch hợp lệ',
        severity: 'error',
      });
    }

    // Cảnh báo nếu không có nơi lưu trú
    if (!data.accommodation || data.accommodation.trim() === '') {
      errors.push({
        field: 'accommodation',
        message: 'Không có loại lưu trú - AI sẽ tự chọn nơi lưu trú cho bạn',
        severity: 'warning',
      });
    }

    // Cảnh báo nếu không có địa điểm bắt buộc
    if (!data.mustVisitPlaces || data.mustVisitPlaces.trim() === '') {
      errors.push({
        field: 'mustVisitPlaces',
        message: 'Không có địa điểm bắt buộc - AI sẽ tự chọn địa điểm cho bạn',
        severity: 'warning',
      });
    }

    return {
      isValid: errors.filter((e) => e.severity === 'error').length === 0,
      errors,
    };
  }

  /**
   * Validate toàn bộ form trước khi submit
   */
  validateAllSteps(
    step1Data: any,
    step2Data: any,
    step3Data: any,
  ): StepValidationResult {
    const errors: ValidationError[] = [];

    const result1 = this.validateStep1(step1Data);
    const result2 = this.validateStep2(step2Data);
    const result3 = this.validateStep3(step3Data);

    errors.push(...result1.errors);
    errors.push(...result2.errors);
    errors.push(...result3.errors);

    return {
      isValid: errors.filter((e) => e.severity === 'error').length === 0,
      errors,
    };
  }

  /**
   * Format error message để hiển thị
   */
  getErrorMessage(error: ValidationError): {
    title: string;
    message: string;
    color: string;
  } {
    const colorMap = {
      error: 'danger',
      warning: 'warning',
    };

    return {
      title: error.severity === 'error' ? '❌ Lỗi' : '⚠️ Cảnh báo',
      message: error.message,
      color: colorMap[error.severity] || 'primary',
    };
  }

  /**
   * Lấy danh sách lỗi (không bao gồm cảnh báo)
   */
  getErrorsOnly(errors: ValidationError[]): ValidationError[] {
    return errors.filter((e) => e.severity === 'error');
  }

  /**
   * Lấy danh sách cảnh báo
   */
  getWarningsOnly(errors: ValidationError[]): ValidationError[] {
    return errors.filter((e) => e.severity === 'warning');
  }
}
