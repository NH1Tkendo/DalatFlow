import { GoogleGenAI } from "@google/genai";

import { getDb } from "../config/firebase.config.js";
import { optimizePlacesForAI } from "../utils/place-optimize.util.js";
import { translateDraftToPromptContext } from "../utils/prompt-builder.util.js";

export const generateSmartItinerary = async (userId, data) => {
  const { days, title, startDate, endDate } = data;

  const placeCollection = getDb().collection("places");
  const itineraryCollection = getDb().collection("itineraries");
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // 1. Lấy danh sách địa điểm từ firebase
  const snapshot = await placeCollection.get();

  // Bốc toàn bộ data thô từ Firestore và nhét doc.id vào trong object
  const rawPlaces = snapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });

  // GỌI HÀM ÉP CÂN: Chuyển hóa hàng ngàn dòng JSON phức tạp thành mảng siêu nhẹ!
  const optimizedPlaces = optimizePlacesForAI(rawPlaces);

  // Chuyển mảng đã tối ưu thành chuỗi văn bản để nhồi vào Prompt
  const placesContextString = JSON.stringify(optimizedPlaces);
  const userContextString = translateDraftToPromptContext(data);
  // --------------------------------------------------------------------------
  // 2. CHUẨN BỊ PROMPT VỚI "RÀNG BUỘC DỮ LIỆU" (Data Constraints)
  // --------------------------------------------------------------------------
  const prompt = `
  Bạn là một "Chuyên gia Lên kế hoạch Du lịch" (Expert Travel Planner) kiêm Hướng dẫn viên bản địa Đà Lạt dày dạn kinh nghiệm.
  Nhiệm vụ của bạn là phân tích yêu cầu của khách hàng và đối chiếu với Cơ sở dữ liệu (Database) để thiết kế một lịch trình thông minh, logic và cá nhân hóa nhất.

  ### 1. THÔNG TIN KHÁCH HÀNG (USER CONTEXT)
  ${userContextString}

  ### 2. CƠ SỞ DỮ LIỆU ĐỊA ĐIỂM (DATABASE)
  Bạn BẮT BUỘC CHỈ ĐƯỢC PHÉP sử dụng các địa điểm trong mảng JSON dưới đây.
  TUYỆT ĐỐI KHÔNG ảo giác (hallucinate) hoặc tự bịa ra các địa điểm nằm ngoài danh sách này.
  <database>
  ${placesContextString}
  </database>

  ### 3. NGUYÊN TẮC XẾP LỊCH TRÌNH (BUSINESS RULES)
  - Quy tắc 1 (Địa lý): Các địa điểm trong cùng một buổi (Sáng/Chiều/Tối) phải nằm trên cùng một tuyến đường hoặc gần nhau để tránh di chuyển xa.
  - Quy tắc 2 (Giờ giấc ĐỜI THỰC): BẮT BUỘC kiểm tra thời gian mở/đóng cửa của địa điểm. TUYỆT ĐỐI KHÔNG xếp lịch vào lúc địa điểm chưa mở hoặc đã đóng cửa.
  - Quy tắc 3 (Sức khỏe & Đối tượng): Nếu phần Số lượng khách có trẻ em/người lớn tuổi, ƯU TIÊN chọn các địa điểm an toàn, dễ đi. Bắt buộc phải có thời gian nghỉ ngơi hợp lý.
  - Quy tắc 4 (Ẩm thực & Thư giãn): Đảm bảo đan xen hợp lý các địa điểm ăn chính và cà phê/tráng miệng vào các khung giờ phù hợp.
  - Quy tắc 5 (Hợp lý hóa thời gian): Đảm bảo có đủ khoảng trống thời gian di chuyển giữa điểm A và điểm B.

  ### 4. ĐỊNH DẠNG ĐẦU RA (STRICT JSON FORMAT)
  Bạn chỉ được phép trả về kết quả là một chuỗi JSON thuần túy, đúng theo cấu trúc dưới đây. Tuyệt đối KHÔNG bọc trong markdown (\`\`\`json) hay thêm bất kỳ văn bản nào bên ngoài block JSON.

  {
    "reasoning": "Suy nghĩ từng bước của bạn (Chain of Thought). Hãy phân tích nhanh lộ trình, thời gian di chuyển và lý do chọn tuyến đường này trước khi tạo mảng days bên dưới.",
    "tripSummary": "Tóm tắt ngắn gọn vibe của chuyến đi (VD: Nhẹ nhàng, khám phá thiên nhiên Đà Lạt)",
    "days": [
      {
        "dayIndex": 1,
        "date": "dd/mm/yyyy",
        "dayTheme": "Tên chủ đề của ngày (VD: Vi vu ngoại ô)",
        "activities": [
          {
            "placeId": "Mã ID lấy chính xác từ thẻ <database>",
            "placeName": "Tên địa điểm lấy từ thẻ <database>",
            "activityType": "Phân loại: 'meal' (ăn uống), 'attraction' (tham quan), 'hotel' (nghỉ ngơi) hoặc 'transport' (di chuyển)",
            "startTime": "HH:mm (Ví dụ: 08:30)",
            "endTime": "HH:mm (Ví dụ: 10:30)",
            "durationMinutes": 120,
            "notes": "Giải thích ngắn gọn (dưới 20 chữ) lý do chọn điểm này."
          }
        ]
      }
    ]
  }
`;

  try {
    // --------------------------------------------------------------------------
    // 3. GỌI GEMINI VÀ XỬ LÝ KẾT QUẢ
    // --------------------------------------------------------------------------
    console.log("Đang gửi prompt đến Gemini...");
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    const responseText = result.text;
    if (!responseText) {
      throw new Error("Gemini không trả về nội dung hợp lệ");
    }
    const generatedData = JSON.parse(responseText);

    // 4. Lưu vào firestore
    const newItinerary = {
      userId: userId,
      // Đặt tên chuyến đi có hồn hơn thay vì chỉ ghi số ngày
      title:
        title ||
        (data.mustGoPlaces?.length > 0
          ? `Chuyến đi Đà Lạt - ${data.mustGoPlaces[0]}`
          : `Vi vu Đà Lạt ${days} ngày`),
      status: "planning",
      tripSummary: generatedData.tripSummary || "",
      reasoning: generatedData.reasoning || "", // Lưu lại tư duy của AI để debug
      days: generatedData.days,
      createdAt: new Date().toISOString(),
      // Lưu lại thông tin gốc khách đã nhập để sau này hiển thị lại nếu cần
      draftSettings: {
        startDate,
        endDate,
        budgetTier: data.budgetTier,
        members: data.members,
      },
    };

    const docRef = await itineraryCollection.add(newItinerary);
    return { id: docRef.id, ...newItinerary };
  } catch (error) {
    console.error("Lỗi tạo lịch trình:", error);
    throw new Error("Không thể tạo lịch trình. Vui lòng thử lại!");
  }
};

export const getUserItineraries = async (userId) => {
  const itineraryCollection = getDb().collection("itineraries");

  const snapshot = await itineraryCollection
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getItineraryById = async (id) => {
  const itineraryCollection = getDb().collection("itineraries");

  const doc = await itineraryCollection.doc(id).get();

  if (!doc.exists) {
    throw new Error("Không tìm thấy lịch trình này!");
  }

  const data = doc.data();

  return { id: doc.id, ...data };
};

export const getAllItinerariesSummary = async () => {
  const itineraryCollection = getDb().collection("itineraries");

  // get() on collection returns a Snapshot, not a single Document
  const snapshot = await itineraryCollection.limit(50).get();

  const itineraries = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    itineraries.push({
      id: doc.id,
      title: data.title || "Lịch trình chưa đặt tên",
    });
  });

  return itineraries;
};
