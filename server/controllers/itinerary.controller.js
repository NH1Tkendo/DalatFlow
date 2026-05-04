import * as itineraryService from "../services/itinerary.service.js";

export const generateItinerary = async (req, res) => {
  try {
    const userId = req.user.uid;
    const userEmail = req.user.email || "user";
    const userName = req.user.name || userEmail.split("@")[0]; // Lấy phần trước @ nếu không có name

    let {
      startDate,
      endDate,
      budgetTier,
      tags,
      members,
      hasElderlyOrKids,
      isVegeterian,
      accommodations,
      mustGoPlaces,
      pace,
    } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    let calculatedDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    if (calculatedDays <= 0) calculatedDays = 1;

    const data = {
      days: calculatedDays, // <--- Biến này dành riêng cho AI Prompt
      startDate,
      endDate,
      budgetTier,
      tags,
      members,
      hasElderlyOrKids,
      isVegeterian,
      accommodations,
      mustGoPlaces,
      pace,
      createdBy: userName, // Thêm tên người tạo
    };

    const result = await itineraryService.generateSmartItinerary(userId, data);

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi hệ thống: " + error.message });
  }
};

export const getMyItineraries = async (req, res) => {
  try {
    const userId = req.user.uid;

    const itineraries = await itineraryService.getUserItineraries(userId);

    res.status(200).json({
      success: true,
      count: itineraries.length,
      data: itineraries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi hệ thống: " + error.message });
  }
};

export const getItineraryDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user ? req.user.uid : null;

    const itinerary = await itineraryService.getItineraryById(id, userId);

    res.status(200).json({ success: true, data: itinerary });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi hệ thống: " + error.message });
  }
};

export const getAllItinerariesSummary = async (req, res) => {
  try {
    const itineraries = await itineraryService.getAllItinerariesSummary();

    const data = itineraries.map((itinerary) => ({
      ...itinerary,
      tripId: itinerary.id,
      rating: 4.5, // Default/Placeholder rating since we don't have it in the collection
      location: "Vietnam", // Default location or derived from places
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi hệ thống: " + error.message });
  }
};
