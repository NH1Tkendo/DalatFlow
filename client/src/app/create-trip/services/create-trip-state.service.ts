import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { TripDraft } from '../models/trip-draft.model';
// 1. Định nghĩa khuôn mẫu dữ liệu chặt chẽ (Tránh lỗi gõ sai chính tả)
const DRAFT_KEY = 'trip_draft_data'; // Chìa khóa để cất vào Tủ sắt

@Injectable({
  providedIn: 'root',
})
export class TripStateService {
  private _storage: Storage | null = null;

  // 2. Khởi tạo "Bàn làm việc" với dữ liệu rỗng ban đầu
  private tripData = new BehaviorSubject<TripDraft>({
    startDate: null,
    endDate: null,
    budgetTier: 2,
    tags: [],
    members: 1,
    hasElderlyOrKids: false,
    isVegeterian: false,
    accommodations: [],
    mustGoPlaces: [],
  });

  // Biến này để các Component (Bước 1, 2, 3) lấy ra xài (Chỉ đọc)
  public currentTripData$ = this.tripData.asObservable();

  // Thêm theo dõi trạng thái đang tạo chuyến đi hay không
  private isGenerating = new BehaviorSubject<boolean>(false);
  public isGenerating$ = this.isGenerating.asObservable();

  constructor(private storage: Storage) {
    this.initStorage();
  }

  // 3. Mở "Tủ sắt" và lấy bản nháp ra ngay khi Service vừa chạy
  async initStorage() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.loadDraft();
  }

  private async loadDraft() {
    const draft = await this._storage?.get(DRAFT_KEY);
    if (draft) {
      // Nếu có nháp hôm qua, đắp ngay lên Bàn làm việc
      this.tripData.next(draft);
      console.log('Đã phục hồi bản nháp chuyến đi từ IndexedDB!');
    }
  }

  // 4. Hàm cốt lõi: Vừa cập nhật RAM, vừa cất vào Ổ cứng
  // Dùng Partial<TripDraft> để cho phép cập nhật lẻ tẻ từng trường (VD: chỉ cập nhật tags)
  async updateTripData(partialData: Partial<TripDraft>) {
    // Lấy dữ liệu hiện tại
    const currentState = this.tripData.getValue();

    // Ghép dữ liệu mới đè lên dữ liệu cũ
    const newState = { ...currentState, ...partialData };

    // Cập nhật lên RAM cho UI phản hồi chớp nhoáng
    this.tripData.next(newState);

    // Âm thầm lưu một bản copy xuống ổ cứng (IndexedDB)
    await this._storage?.set(DRAFT_KEY, newState);
  }

  // 5. Hàm dọn dẹp: Dùng khi khách đã bấm "Hoàn tất" ở Bước 3
  async clearDraft() {
    this.tripData.next({
      startDate: null,
      endDate: null,
      budgetTier: 2,
      tags: [],
      members: 1,
      hasElderlyOrKids: false,
      isVegeterian: false,
      accommodations: [],
      mustGoPlaces: [],
    });
    if (this._storage) {
      await this._storage.remove(DRAFT_KEY);
    }
  }

  setGenerating(status: boolean) {
    this.isGenerating.next(status);
  }
}
