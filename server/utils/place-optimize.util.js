export function optimizePlacesForAI(rawPlaces) {
  return rawPlaces.map((raw, index) => {
    // --- 1. XỬ LÝ THỜI GIAN LƯU TRÚ (Vá lỗi avgVisitTime = 0) ---
    let duration = raw.avgVisitTime || 0;
    const categoryString = (raw.tags || []).join(" ").toLowerCase();

    if (duration === 0) {
      if (categoryString.includes("cà phê") || categoryString.includes("cafe")) {
        duration = 60; // Quán cafe mặc định ngồi 1 tiếng
      } else if (categoryString.includes("nhà hàng") || categoryString.includes("quán ăn")) {
        duration = 90; // Ăn uống mặc định 1.5 tiếng
      } else {
        duration = 120; // Điểm tham quan, thiên nhiên mặc định 2 tiếng
      }
    }

    // --- 2. XỬ LÝ GIỜ MỞ CỬA (Lấy đại diện 1 ngày để tiết kiệm Token) ---
    let hours = "Mở cửa tự do";
    if (raw.operatingHours) {
      // Thông thường giờ mở cửa các ngày khá giống nhau, ta lấy ngày đầu tiên có dữ liệu
      const firstAvailableDay = Object.keys(raw.operatingHours)[0];
      if (firstAvailableDay) {
        hours = raw.operatingHours[firstAvailableDay];
      }
    }

    // --- 3. LÀM PHẲNG CÁC ĐẶC ĐIỂM (Features & Facilities) ---
    // Gom tất cả tags, description và các mảng trong facilities thành một câu văn
    const featureKeywords = [];

    // Lấy tags
    if (raw.tags && raw.tags.length > 0) {
      featureKeywords.push(`Danh mục: ${raw.tags.join(", ")}`);
    }

    // Quét object 'facilities' để nhặt các mảng KHÔNG rỗng
    if (raw.facilities) {
      const facilityValues = [];
      for (const key in raw.facilities) {
        const arr = raw.facilities[key];
        // Chỉ lấy những mảng có chứa dữ liệu (Bỏ qua mảng rỗng như của Vườn Cẩm Tú Cầu)
        if (Array.isArray(arr) && arr.length > 0) {
          facilityValues.push(...arr);
        }
      }
      if (facilityValues.length > 0) {
        featureKeywords.push(`Tiện ích & Không khí: ${facilityValues.join(", ")}`);
      }
    }

    // Thêm mô tả (nếu có)
    if (raw.description && raw.description.trim() !== "") {
      featureKeywords.push(`Mô tả: ${raw.description}`);
    }

    // --- 4. TRÍCH XUẤT TỌA ĐỘ (Đảm bảo không bị lỗi) ---
    let lat = 0;
    let lng = 0;
    // Tùy thuộc vào cách thư viện Firebase của bạn trả về geoPoint
    if (raw.geoPoint) {
      lat = raw.geoPoint.latitude || (Array.isArray(raw.geoPoint) ? raw.geoPoint[0] : 0);
      lng = raw.geoPoint.longitude || (Array.isArray(raw.geoPoint) ? raw.geoPoint[1] : 0);
    }

    // --- 5. ĐÓNG GÓI THÀNH OBJECT SIÊU NHẸ CHO AI ---
    return {
      placeId: raw.id || `PLACE_${index}`, // Bắt buộc phải có ID để map lại trên UI
      name: raw.name || "Địa điểm chưa rõ tên",
      operatingHours: hours,
      visitDurationMinutes: duration,
      features: featureKeywords.join(". "), // Nối lại thành 1 đoạn văn dài
      rating: raw.rating || 0,
      // lat: lat,
      // lng: lng
    };
  });
}
