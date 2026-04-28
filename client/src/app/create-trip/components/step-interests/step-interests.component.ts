import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular/standalone';
import { TripStateService } from '../../services/create-trip-state.service';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  checkmarkOutline,
  cameraOutline,
  restaurantOutline,
  leafOutline,
  airplaneOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-step-interests',
  templateUrl: './step-interests.component.html',
  styleUrls: ['./step-interests.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class StepInterestsComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();
  @Output() prevStep = new EventEmitter<void>();

  // Dữ liệu render ra giao diện
  public tagsList = [
    { id: 'chill', name: 'Chill', icon: 'leaf-outline' },
    { id: 'mao_hiem', name: 'Mạo hiểm', icon: 'walk-outline' },
    { id: 'am_thuc', name: 'Ẩm thực', icon: 'restaurant-outline' },
    { id: 'song_ao', name: 'Sống ảo', icon: 'camera-outline' },
    { id: 'van_hoa', name: 'Văn hóa', icon: 'business-outline' },
    { id: 'nghi_duong', name: 'Nghỉ dưỡng', icon: 'bed-outline' },
  ];

  public companionTypes = [
    { id: 'solo', name: '1 mình', icon: 'person-outline' },
    { id: 'couple', name: 'Cặp đôi', icon: 'heart-outline' },
    { id: 'family', name: 'Gia đình', icon: 'home-outline' },
    { id: 'friends', name: 'Bạn bè', icon: 'people-outline' },
  ];

  // Trạng thái lưu trữ tạm
  public stepData = {
    tags: [] as string[],
    members: 2,
    hasElderlyOrKids: false,
  };

  currentStepIndex: number = 1; // Thêm biến để nhận index từ Input

  constructor(
    private tripStateService: TripStateService,
    private toastCtrl: ToastController,
  ) {
    addIcons({
      arrowForwardOutline,
      checkmarkOutline,
      cameraOutline,
      restaurantOutline,
      leafOutline,
      airplaneOutline,
    });
  }

  ngOnInit() {
    // Kéo dữ liệu nháp từ Tủ sắt đắp lên UI
    this.tripStateService.currentTripData$.subscribe((draft) => {
      if (draft) {
        this.stepData.tags = draft.tags || [];
        this.stepData.members = draft.members || 2;
        this.stepData.hasElderlyOrKids = draft.hasElderlyOrKids || false;
      }
    });
  }

  // Logic Chọn/Hủy Tag (Tối đa 3)
  async toggleTag(tagId: string) {
    const index = this.stepData.tags.indexOf(tagId);
    if (index > -1) {
      this.stepData.tags.splice(index, 1); // Đã có -> Xóa đi
    } else {
      if (this.stepData.tags.length < 3) {
        this.stepData.tags.push(tagId); // Chưa đủ 3 -> Thêm vào
      } else {
        // Cảnh báo nếu chọn lố
        const toast = await this.toastCtrl.create({
          message: 'Chỉ được chọn tối đa 3 phong cách thôi nhé!',
          duration: 2000,
          color: 'warning',
          position: 'top',
        });
        await toast.present();
      }
    }
  }

  // Logic nút Tăng/Giảm thành viên
  changeMembers(delta: number) {
    const newVal = this.stepData.members + delta;
    if (newVal >= 1) {
      this.stepData.members = newVal;
    }
  }

  // Cập nhật trạng thái người lớn tuổi/trẻ em
  toggleElderlyOrKids() {
    this.stepData.hasElderlyOrKids = !this.stepData.hasElderlyOrKids;
  }

  // Lưu và chuyển bước
  async saveAndGo(direction: 'next' | 'prev') {
    if (direction === 'next' && this.stepData.tags.length === 0) {
      const toast = await this.toastCtrl.create({
        message: 'Vui lòng chọn ít nhất 1 phong cách!',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    await this.tripStateService.updateTripData({
      tags: this.stepData.tags,
      members: this.stepData.members,
      hasElderlyOrKids: this.stepData.hasElderlyOrKids,
    });

    direction === 'next' ? this.nextStep.emit() : this.prevStep.emit();
  }
}
