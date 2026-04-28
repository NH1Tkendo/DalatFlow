export function translateDraftToPromptContext(draft) {
  // 1. THÔNG DỊCH NGÂN SÁCH (budgetTier)
  let budgetInstruction = "";
  switch (draft.budgetTier) {
    case 1:
      budgetInstruction =
        "Tiết kiệm (Budget): Ưu tiên quán ăn bình dân, street food, chợ đêm. Các điểm tham quan phải miễn phí hoặc giá vé rất rẻ (dưới 50.000đ). TUYỆT ĐỐI KHÔNG chọn nhà hàng cao cấp hay resort.";
      break;
    case 2:
      budgetInstruction =
        "Tiêu chuẩn (Standard): Kết hợp giữa ẩm thực địa phương đặc sắc và nhà hàng/cafe tầm trung. Các khu du lịch có thu phí cơ bản. Đây là mức chi tiêu phổ thông.";
      break;
    case 3:
      budgetInstruction =
        "Thoải mái (Luxury/Comfort): Mức chi tiêu cao. Ưu tiên các nhà hàng sang trọng, quán cafe có view xuất sắc/đầu tư cao, và các dịch vụ du lịch chất lượng cao, trọn gói.";
      break;
    default:
      budgetInstruction = "Tiêu chuẩn (Standard).";
  }

  // 2. THÔNG DỊCH NHỊP ĐỘ (pace) - Đã cập nhật khớp với UI ('slow', 'medium', 'fast')
  let paceInstruction = "";
  switch (draft.pace) {
    case "slow":
    case "Thong thả":
      paceInstruction =
        "Thong thả (Relaxed): Lịch trình cực kỳ giãn cách. Tối đa 3-4 địa điểm/ngày. Thời gian lưu trú (durationMinutes) tại mỗi điểm phải từ 90 - 150 phút. Bắt buộc phải có thời gian nghỉ trưa dài và các trạm dừng chân cafe thư giãn.";
      break;
    case "fast":
    case "Nhanh":
      paceInstruction =
        "Nhanh (Fast-paced): Lịch trình năng động, di chuyển nhiều. Khoảng 6-8 địa điểm/ngày. Thời gian lưu trú (durationMinutes) ngắn, khoảng 30 - 45 phút/điểm, chủ yếu để check-in và chụp ảnh.";
      break;
    case "medium":
    case "Vừa phải":
    default:
      paceInstruction =
        "Vừa phải (Moderate): Tốc độ di chuyển cân bằng. Khoảng 4-5 địa điểm/ngày. Thời gian lưu trú (durationMinutes) từ 60 - 90 phút/điểm.";
  }

  // 3. THÔNG DỊCH SỞ THÍCH (tags)
  const tagsInstruction =
    draft.tags && draft.tags.length > 0
      ? `ƯU TIÊN CAO NHẤT: Bạn hãy quét văn bản trong thẻ <database>. Ưu tiên chọn ra những địa điểm khớp với các sở thích sau: [${draft.tags.join(", ")}].`
      : "Không có sở thích đặc thù, hãy chọn những địa điểm mang tính biểu tượng và nổi tiếng nhất của Đà Lạt.";

  // 4. THÔNG DỊCH YÊU CẦU ĐẶC BIỆT
  let specialRequirements = [];

  if (draft.isVegeterian) {
    specialRequirements.push(
      "- Chế độ ăn chay: BẮT BUỘC các địa điểm ăn uống (meal) phải là nhà hàng chay hoặc có menu đồ chay rõ ràng.",
    );
  }

  if (draft.hasElderlyOrKids) {
    specialRequirements.push(
      "- Có trẻ em/người lớn tuổi: BẮT BUỘC chọn các địa điểm dễ đi lại, địa hình bằng phẳng, an toàn. Tuyệt đối KHÔNG chọn các điểm trekking mạo hiểm hoặc quán cafe phải leo dốc cao.",
    );
  }

  // Xử lý nơi lưu trú (Giúp AI biết chỗ bắt đầu đi và kết thúc mỗi ngày)
  let accommodationInstruction = "";
  if (draft.accommodations && draft.accommodations.length > 0) {
    accommodationInstruction = `- NƠI LƯU TRÚ CỦA KHÁCH: "${draft.accommodations.join(", ")}". Hãy coi đây là điểm bắt đầu xuất phát vào buổi sáng và điểm kết thúc trở về vào buổi tối. Hãy xếp lộ trình xoay quanh khu vực này cho hợp lý.`;
    specialRequirements.push(accommodationInstruction);
  }

  // Xử lý địa điểm bắt buộc phải đi
  let mustGoInstruction = "";
  if (draft.mustGoPlaces && draft.mustGoPlaces.length > 0) {
    mustGoInstruction = `- ĐỊA ĐIỂM BẮT BUỘC: Bạn BẮT BUỘC phải đưa các địa điểm sau vào lịch trình, sắp xếp vào khung giờ và lộ trình hợp lý nhất: [${draft.mustGoPlaces.join(", ")}].`;
    specialRequirements.push(mustGoInstruction);
  }

  // 5. RÁP LẠI THÀNH MỘT KHỐI VĂN BẢN CHỈ THỊ HOÀN CHỈNH
  // Lưu ý: Dùng draft.members thay vì draft.people để tránh lỗi do không khớp tên biến
  return `
- Thời gian đi: ${draft.startDate} đến ${draft.endDate}
- Giờ hoạt động mỗi ngày: Bắt đầu từ 08:00 sáng đến tối đa 22:00 đêm.
- Số lượng khách: ${draft.members || draft.people || 1} người
- Ngân sách: ${budgetInstruction}
- Nhịp độ: ${paceInstruction}
- Phong cách: ${tagsInstruction}
- Yêu cầu đặc biệt & Ràng buộc:
  ${specialRequirements.length > 0 ? specialRequirements.join("\n  ") : "Không có yêu cầu đặc biệt."}
  `.trim();
}
