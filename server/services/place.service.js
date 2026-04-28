import { getDb } from "../config/firebase.config.js";
// Thêm bộ nhớ đệm để tránh truy vấn nhiều lần
let cachedPlaces = null;
let lastFetchTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export const getAllPlaces = async () => {
  const currentTime = Date.now();

  // 1. Nếu có dữ liệu trong RAM và chưa hết hạn -> Trả về luôn, không hỏi Firestore!
  if (cachedPlaces && currentTime - lastFetchTime < CACHE_DURATION) {
    return cachedPlaces;
  }

  // 2. Nếu không có thì truy vấn trên firebase
  const placesSnapshot = await getDb().collection("places").get();
  const results = placesSnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      placeId: doc.id,
      name: data.name || "",
      lat: data.geoPoint?.latitude || 0,
      lng: data.geoPoint?.longitude || 0,
      category: data.tags,
      rating: data.rating,
    };
  });
  //3. Lưu vào bộ nhớ đệm
  cachedPlaces = results;
  lastFetchTime = currentTime;

  return results;
};

export const searchPlaces = async (q, tag) => {
  let query = getDb().collection("places");

  if (tag) {
    query = query.where("tags", "array-contains", tag);
  }

  const placesSnapshot = await query.get();
  let results = placesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (q) {
    const kw = q.toLowerCase().trim();
    results = results.filter((place) => {
      const name = place.name?.toLowerCase() || "";
      const desc = place.description?.toLowerCase() || "";
      const address = place.address?.toLowerCase() || "";
      return name.includes(kw) || desc.includes(kw) || address.includes(kw);
    });
  }

  return results;
};
