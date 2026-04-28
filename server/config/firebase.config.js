import admin from "firebase-admin";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const initializeFirebase = () => {
  try {
    const serviceAccount = JSON.parse(
      readFileSync(join(__dirname, "./serviceAccountKey.json"), "utf8"),
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
    process.exit(1);
  }
};

export const getDb = () => admin.firestore();

export const getAuth = () => admin.auth();
