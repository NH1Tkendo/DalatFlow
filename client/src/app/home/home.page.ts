import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, LoadingController } from '@ionic/angular/standalone';
import L from 'leaflet';
import { MarkerService } from './services/marker.service';
import { createPin } from './utils/map-icon.util';
import { MapControlsComponent } from './components/map-controls/map-controls.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FilterTagsComponent } from './components/filter-tags/filter-tags.component';
import { FilterTag } from './models/filter-tag.model';
import { Geolocation } from '@capacitor/geolocation';
import { normalizeCategory } from './utils/map-icon.util';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    MapControlsComponent,
    SearchBarComponent,
    FilterTagsComponent,
  ],
})
export class HomePage implements OnInit {
  map: any;
  private markerLayerGroup: L.LayerGroup = L.layerGroup();
  private userMarker: L.Marker | null = null;

  constructor(
    private markerService: MarkerService,
    private loadingCtrl: LoadingController,
  ) {}

  // Trạng thái tìm kiếm
  currentSearchQuery: string = '';

  filterTags: FilterTag[] = [
    { id: 'attraction', label: 'Điểm tham quan', selected: true },
    { id: 'restaurant', label: 'Ẩm thực', selected: false },
    { id: 'hotel', label: 'Cơ sở lưu trú', selected: false },
    { id: 'police', label: 'Cơ quan An ninh', selected: false },
    { id: 'medical', label: 'Cơ sở y tế', selected: false },
    { id: 'atm', label: 'ATM', selected: false },
  ];

  async ngOnInit() {
    // 1. Bật vòng xoay chờ
    const loading = await this.loadingCtrl.create({
      message: 'Đang tải dữ liệu bản đồ...',
      spinner: 'crescent',
    });

    await loading.present();

    try {
      // 2. Tải dữ liệu bản đồ
      await this.markerService.loadAllPlacesOnce();
      this.updateTagCounts();
      // 3. Khởi tạo bản đồ
      this.ionViewDidEnter();
    } catch (error) {
      console.error('Lỗi tải bản đồ', error);
    } finally {
      // 4. Tắt vòng xoay chờ dù thành công hay thất bại
      await loading.dismiss();
    }
  }

  ionViewDidEnter() {
    // Prevent initializing map a second time if already initialized
    if (this.map) {
      return;
    }

    const southWest = L.latLng(11.8, 108.35); // Góc dưới trái (Gần đèo Prenn)
    const northEast = L.latLng(12.05, 108.55); // Góc trên phải (Qua khỏi Langbiang / Trại Mát)
    const dalatBounds = L.latLngBounds(southWest, northEast);

    this.map = L.map('dalat-map', {
      zoomControl: false,
      attributionControl: false,
      maxBounds: dalatBounds,
      minZoom: 12,
    }).setView([11.9425, 108.4435], 15);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 20,
        detectRetina: true,
      },
    ).addTo(this.map);

    // Thêm LayerGroup chứa marker vào bản đồ
    this.markerLayerGroup.addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
      this.callMarkerService();
    }, 400);

    this.map.on('moveend', () => {
      this.callMarkerService();
    });
  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  async locateUser() {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      this.map?.flyTo([lat, lng], 15);

      if (this.userMarker) {
        this.userMarker.setLatLng([lat, lng]);
      } else {
        const userIcon = L.divIcon({
          className: 'user-location-marker',
          html: '<div style="background-color: #2dd36f; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        this.userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(
          this.map,
        );
      }
    } catch (error) {
      console.error('Error getting location', error);
      // You could show a toast here to inform user
    }
  }

  updateTagCounts() {
    const allPlaces = this.markerService.allPlaces;
    this.filterTags = this.filterTags.map((tag) => {
      if (tag.selected) {
        const count = allPlaces.filter((p) => {
          let cat = p.category;
          if (!cat) cat = 'attraction'; // default according to icon util

          const normalized = normalizeCategory(cat);
          return normalized === tag.id;
        }).length;
        return { ...tag, count };
      }
      return { ...tag, count: undefined };
    });
  }

  callMarkerService() {
    const bounds = this.map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    // 1. Lấy danh sách ID các bộ lọc đang bật
    const selectedIds = this.filterTags
      .filter((tag) => tag.selected)
      .map((tag) => tag.id);

    // 2. Điều kiện hiển thị tên
    const currentZoom = this.map.getZoom();
    const isZoomedIn = currentZoom >= 18;

    this.markerService
      .getPlacesInBounds(sw, ne, selectedIds)
      .subscribe((places) => {
        // Xóa marker cũ
        this.markerLayerGroup.clearLayers();

        // TẠO MỘT MẢNG TẠM ĐỂ GOM MARKER (Tối ưu hiệu năng)
        const markersToAdd: L.Marker[] = [];

        // Vòng lặp vẽ marker mới
        places.forEach((place) => {
          const customIcon = createPin(place.category || 'hotel');
          const marker = L.marker([place.lat, place.lng], { icon: customIcon });

          // TỐI ƯU UX: Đảm bảo khách luôn xem được tên địa điểm
          if (isZoomedIn) {
            // Mức 1: Zoom sát (>=18) -> Hiện tên vĩnh viễn ở dưới ghim (như Google Maps)
            marker.bindTooltip(`<b>${place.name}</b>`, {
              permanent: true,
              direction: 'bottom',
              offset: [0, 5],
              className: 'map-label-permanent',
            });
          } else {
            // Mức 2: Zoom xa (<18) -> Giấu tên cho đỡ rối, nhưng BẤM VÀO GHIM là phải hiện tên (Popup)
            marker.bindPopup(`<b>${place.name}</b>`, {
              offset: [0, -20],
            });
          }

          // CHỈ PUSH VÀO MẢNG TẠM, KHÔNG ADD LÊN MAP TRONG VÒNG LẶP NÀY
          markersToAdd.push(marker);
        });

        // ĐỔ TOÀN BỘ MẢNG LÊN MAP CÙNG MỘT LÚC
        // Nếu bạn xài MarkerClusterGroup (Gom cụm) thì dùng hàm addLayers(markersToAdd)
        // Nếu bạn xài LayerGroup thường của Leaflet, thì phải duyệt mảng để add (như bên dưới)
        markersToAdd.forEach((m) => this.markerLayerGroup.addLayer(m));
      });
  }

  // Kết hợp trạng thái để gọi service:
  fetchData() {
    const selectedFilterIds = this.filterTags
      .filter((t) => t.selected)
      .map((t) => t.id);

    console.log('Fetching data with API...', {
      searchQuery: this.currentSearchQuery,
      filters: selectedFilterIds,
    });
  }

  onSearch(query: string) {
    this.currentSearchQuery = query;
    this.fetchData();
  }

  onFiltersChange(updatedTags: FilterTag[]) {
    this.filterTags = updatedTags;
    this.updateTagCounts();
    this.callMarkerService();
  }
}
