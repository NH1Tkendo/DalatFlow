import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  walkOutline,
  bodyOutline,
  flashOutline,
  bedOutline,
  speedometerOutline,
  locationOutline,
  checkmarkCircle,
  businessOutline, // Thêm icon này cho khách sạn
} from 'ionicons/icons';
import { TripStateService } from '../../services/create-trip-state.service';
import { MarkerService } from 'src/app/home/services/marker.service';

@Component({
  selector: 'app-step-details',
  templateUrl: './step-details.component.html',
  styleUrls: ['./step-details.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class StepDetailsComponent implements OnInit {
  @Output() submitForm = new EventEmitter<void>();
  @Output() prevStep = new EventEmitter<void>();

  public stepData = {
    isVegetarian: false,
    accommodation: '',
    pace: 'medium', // 'slow', 'medium', 'fast'
    mustVisitPlaces: '',
  };

  public paces = [
    { id: 'slow', name: 'Thong thả', icon: 'walk-outline' },
    { id: 'medium', name: 'Vừa phải', icon: 'body-outline' },
    { id: 'fast', name: 'Nhanh', icon: 'flash-outline' },
  ];

  // --- BIẾN TRẠNG THÁI CHO AUTOCOMPLETE ---
  public accoResults: any[] = [];
  public isAccoDropdownOpen: boolean = false;

  public mustVisitResults: any[] = [];
  public isMustVisitDropdownOpen: boolean = false;

  constructor(
    private tripStateService: TripStateService,
    public markerService: MarkerService, // Inject MarkerService vào đây
  ) {
    addIcons({
      'walk-outline': walkOutline,
      'body-outline': bodyOutline,
      'flash-outline': flashOutline,
      'bed-outline': bedOutline,
      'speedometer-outline': speedometerOutline,
      'location-outline': locationOutline,
      'checkmark-circle': checkmarkCircle,
      'business-outline': businessOutline, // Đăng ký icon
    });
  }

  ngOnInit() {
    // Đảm bảo dữ liệu allPlaces đã được tải (đề phòng user vào thẳng /create-trip mà bỏ qua home)
    if (
      !this.markerService.allPlaces ||
      this.markerService.allPlaces.length === 0
    ) {
      this.markerService.loadAllPlacesOnce().catch((err) => {
        console.error('Không thể tự động tải danh sách địa điểm:', err);
      });
    }

    this.tripStateService.currentTripData$.subscribe((draft) => {
      if (draft) {
        this.stepData.isVegetarian = draft.isVegeterian || false;

        this.stepData.accommodation =
          draft.accommodations && draft.accommodations.length > 0
            ? draft.accommodations[0]
            : '';

        this.stepData.pace = draft.pace || 'medium';

        this.stepData.mustVisitPlaces =
          draft.mustGoPlaces && draft.mustGoPlaces.length > 0
            ? draft.mustGoPlaces.join(', ')
            : '';
      }
    });
  }

  selectPace(paceId: string) {
    this.stepData.pace = paceId;
  }

  // ==========================================
  // 1. LOGIC TÌM KIẾM NƠI LƯU TRÚ
  // ==========================================
  onSearchAccommodation(event: any) {
    const query = event.target.value?.toLowerCase().trim() || '';
    this.stepData.accommodation = event.target.value;

    // Phải chắc chắn MarkerService đã load xong allPlaces
    if (query.length > 1 && this.markerService.allPlaces?.length > 0) {
      this.accoResults = this.markerService.allPlaces
        .filter((p) => {
          const catStr = Array.isArray(p.category)
            ? p.category.join(' ').toLowerCase()
            : (p.category || '').toLowerCase();

          return (
            p.name?.toLowerCase().includes(query) &&
            (catStr.includes('khách sạn') ||
              catStr.includes('chỗ ở') ||
              catStr.includes('homestay') ||
              catStr.includes('resort') ||
              catStr.includes('khu nghỉ dưỡng'))
          );
        })
        .slice(0, 4);

      this.isAccoDropdownOpen = this.accoResults.length > 0;
    } else {
      this.isAccoDropdownOpen = false;
    }
  }

  selectAccommodation(place: any) {
    this.stepData.accommodation = place.name;
    this.isAccoDropdownOpen = false;
  }

  clearAccommodation() {
    this.stepData.accommodation = '';
    this.isAccoDropdownOpen = false;
  }

  // ==========================================
  // 2. LOGIC TÌM KIẾM ĐỊA ĐIỂM BẮT BUỘC
  // ==========================================
  onSearchMustVisit(event: any) {
    const query = event.target.value?.toLowerCase() || '';
    this.stepData.mustVisitPlaces = event.target.value;

    // Tuyệt chiêu: Tách chuỗi bằng dấu phẩy để lấy từ khóa cuối cùng đang gõ
    const terms = query.split(',').map((t: string) => t.trim());
    const currentTerm = terms[terms.length - 1];

    if (currentTerm.length > 1 && this.markerService.allPlaces?.length > 0) {
      this.mustVisitResults = this.markerService.allPlaces
        .filter((p) => p.name?.toLowerCase().includes(currentTerm))
        .slice(0, 4);

      this.isMustVisitDropdownOpen = this.mustVisitResults.length > 0;
    } else {
      this.isMustVisitDropdownOpen = false;
    }
  }

  selectMustVisit(place: any) {
    // Thêm địa điểm vào chuỗi hiện tại, ngăn cách bằng dấu phẩy
    let currentText = this.stepData.mustVisitPlaces;

    // Xóa cái đoạn đang gõ dở đi
    const lastCommaIndex = currentText.lastIndexOf(',');
    if (lastCommaIndex !== -1) {
      currentText = currentText.substring(0, lastCommaIndex + 1) + ' ';
    } else {
      currentText = ''; // Nếu chưa có dấu phẩy nào thì reset
    }

    // Nối tên điểm mới vào và thêm dấu phẩy sẵn cho tiện
    this.stepData.mustVisitPlaces = currentText + place.name + ', ';
    this.isMustVisitDropdownOpen = false;
  }

  clearMustVisit() {
    this.stepData.mustVisitPlaces = '';
    this.isMustVisitDropdownOpen = false;
  }

  // ==========================================
  // 3. LƯU VÀ CHUYỂN BƯỚC
  // ==========================================
  async saveAndGo(direction: 'next' | 'prev') {
    await this.tripStateService.updateTripData({
      isVegeterian: this.stepData.isVegetarian,
      accommodations: this.stepData.accommodation
        ? [this.stepData.accommodation]
        : [],
      pace: this.stepData.pace,
      // Lọc bỏ các phần tử rỗng do dấu phẩy thừa ở cuối chuỗi
      mustGoPlaces: this.stepData.mustVisitPlaces
        ? this.stepData.mustVisitPlaces
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        : [],
    });

    if (direction === 'next') {
      this.submitForm.emit();
    } else {
      this.prevStep.emit();
    }
  }
}
