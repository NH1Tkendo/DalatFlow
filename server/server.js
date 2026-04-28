import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { initializeFirebase } from "./config/firebase.config.js";
import authRoute from "./routes/auth.route.js";
import itineraryRoute from "./routes/itinerary.route.js";
import placeRoute from "./routes/place.route.js";
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Initialize Firebase
initializeFirebase();

// Middleware
const allowedOrigins = [
  "https://nh1tkendo.github.io",
  "https://ngobatai.dev",
  "http://localhost:8100", // Thường dùng cho dev Ionic
  "http://localhost:4200", // Thường dùng cho dev Angular
  "https://localhost",
  "http://localhost",
  "capacitor://localhost",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép requests không có origin (ví dụ: mobile apps, postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        var msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/api/auth", authRoute);
app.use("/api/places", placeRoute);
app.use("/api/itineraries", itineraryRoute);

// Route giả lập lỗi để test pm2 tự động restart
app.get("/api/crash", (req, res) => {
  console.log("Giả lập lỗi sập server (crash)...");
  process.exit(1); // Ép server thoát ra ngay lập tức
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
