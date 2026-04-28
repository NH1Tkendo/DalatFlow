import * as placeService from "../services/place.service.js";

export const getAllPlaces = async (req, res) => {
  try {
    const places = await placeService.getAllPlaces();
    res.status(200).json({ success: true, data: places });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi hệ thống: " + error.message });
  }
};

export const searchPlaces = async (req, res) => {
  const { q, tag } = req.query;
  try {
    const places = await placeService.searchPlaces(q, tag);
    res.status(200).json({ success: true, data: places });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi hệ thống: " + error.message });
  }
};
