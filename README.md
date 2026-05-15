Here is the `README.md` for the DalatFlow project, following your specified structure and guidelines:

# 🏔️ DalatFlow - AI-Powered Da Lat Itinerary Planner

## 1. Badges

[![Angular](https://img.shields.io/badge/Angular-20.0-DD0031?style=flat-square&logo=angular)](https://angular.io/)
[![Ionic](https://img.shields.io/badge/Ionic-8.0-3880FF?style=flat-square&logo=ionic)](https://ionicframework.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Database-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=flat-square&logo=leaflet)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## 2. Project Title & Description

**DalatFlow** is an intelligent cross-platform application designed to revolutionize travel planning in Da Lat, Vietnam. Leveraging **Artificial Intelligence**, it automates and personalizes your trip planning, transforming how you discover the 'City of Eternal Spring'. This application provides an interactive experience for crafting unique and optimized itineraries based on your preferences, budget, and time.

Key features include:

*   **AI-Powered Recommendation Engine**: Utilizes Google Generative AI to suggest personalized itineraries, optimized for time, interests, and real-time conditions.
*   **Interactive Map Interface**: Explore Da Lat's attractions on a dynamic map powered by Leaflet, featuring smart clustering and comprehensive search/filter capabilities.
*   **Seamless Itinerary Management**: Create, edit, save, and share your travel plans with ease, backed by Firebase Cloud synchronization.
*   **Cross-Platform Accessibility**: Available as a Progressive Web App (PWA) for web browsers and as native mobile applications for iOS/Android via Capacitor.
*   **Secure Authentication**: Integrated with Firebase Authentication for secure user logins and data management.
*   **Offline Support**: Ensures continuous access to your saved itineraries and map data through Ionic Storage, with automatic synchronization upon connection.

## 3. Tech Stack

DalatFlow is built using a modern full-stack architecture, combining robust frontend and backend technologies:

**Client-Side (Frontend)**:

*   **Framework**: [Angular 20.0](https://angular.io/)
*   **Mobile UI**: [Ionic 8.0](https://ionicframework.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Cross-Platform**: [Capacitor](https://capacitorjs.com/) (for iOS/Android deployment)
*   **Mapping**: [Leaflet](https://leafletjs.com/) with `leaflet.markercluster`
*   **State Management/Reactive Programming**: [RxJS](https://rxjs.dev/)
*   **Authentication & Data Storage**: [Firebase Client SDK](https://firebase.google.com/docs/web/setup) via `@angular/fire`
*   **Offline Data**: [Ionic Storage](https://ionicframework.com/docs/angular/storage)
*   **HTTP Client**: `@angular/common/http`

**Server-Side (Backend)**:

*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Web Framework**: [Express.js 4.18](https://expressjs.com/)
*   **AI Integration**: [Google Generative AI](https://ai.google.dev/) (`@google/genai`)
*   **Authentication & Database**: [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
*   **Environment Variables**: [Dotenv](https://www.npmjs.com/package/dotenv)
*   **CORS Management**: [CORS](https://www.npmjs.com/package/cors)
*   **Process Management**: [PM2](https://pm2.keymetrics.io/)

## 4. Architecture

DalatFlow employs a classic client-server architecture with a monorepo structure, separating the frontend and backend into distinct directories (`client/` and `server/`).

*   **Client (Frontend)**:
    *   Developed with **Angular** and **Ionic**, forming a Progressive Web App (PWA). This allows it to run seamlessly on web browsers (desktop and mobile) and be packaged as native mobile applications for iOS and Android using **Capacitor**.
    *   Manages the user interface, interactive map (powered by **Leaflet**), user input for itinerary creation, and display of search results.
    *   Communicates with the backend API for data fetching, itinerary generation requests, and user authentication, primarily utilizing **Firebase Client SDK** for user management and `@angular/common/http` for custom API calls.
*   **Server (Backend)**:
    *   Built on **Node.js** with the **Express.js** framework, it provides a RESTful API.
    *   Handles core business logic, including:
        *   User authentication and authorization (via **Firebase Admin SDK**).
        *   Storing and retrieving itinerary data from Firebase.
        *   Processing requests for AI-powered itinerary generation by interacting with **Google Generative AI**.
        *   Managing place data and optimizing routes.
    *   Includes middleware for authentication, request validation, and CORS configuration.

This separation ensures a scalable, maintainable, and flexible application where the frontend focuses on user experience and the backend on data management and complex logic.

## 5. Installation

Follow these steps to set up and run DalatFlow locally on your machine.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: v18.0.0 or higher. [Download here](https://nodejs.org/)
*   **npm** or **Yarn**: A package manager (npm comes with Node.js).
*   **Git**: For cloning the repository.

Verify your installations:

```bash
node --version # e.g., v18.x.x
npm --version  # e.g., 9.x.x
git --version  # e.g., 2.x.x
```

### Step 1: Clone the Repository

Clone the project from GitHub and navigate into its directory:

```bash
git clone https://github.com/NH1Tkendo/DalatFlow.git
cd DalatFlow
```

### Step 2: Configure Environment Variables

#### Server Configuration (`server/.env`)

Navigate to the `server` directory and create a `.env` file for environment variables:

```bash
cd server
touch .env
```

Populate the `.env` file with your credentials:

```env
# Firebase Configuration for Admin SDK
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n" # Ensure newlines are correctly formatted
FIREBASE_CLIENT_EMAIL=your-firebase-client-email@your-project-id.iam.gserviceaccount.com

# Google Generative AI
GOOGLE_API_KEY=your-google-generative-ai-key

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration - Set to your client's URL
CLIENT_URL=http://localhost:4200
```

**How to get these keys**:

1.  **Firebase Admin SDK Keys**:
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Select your project or create a new one.
    *   Navigate to Project settings > Service accounts.
    *   Click "Generate new private key" to download a JSON file.
    *   Extract `project_id`, `private_key`, and `client_email` from the JSON file and paste them into your `.env`. Be careful with the `private_key` formatting, ensuring newline characters (`\n`) are preserved.
2.  **Google Generative AI Key**:
    *   Visit [Google AI Studio](https://aistudio.google.com/).
    *   Create a new API Key.
    *   Copy the key and assign it to `GOOGLE_API_KEY`.

#### Client Configuration (`client/src/environments/environment.ts`)

Open the `client/src/environments/environment.ts` file and update the `firebaseConfig` and `apiUrl` with your project's details:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_FIREBASE_API_KEY", // From Firebase Project settings > General > Your apps
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:YOUR_APP_ID:web:YOUR_WEB_APP_ID",
  },
  apiUrl: "http://localhost:3000", // Should match your server's PORT
};
```

You can find the `firebaseConfig` details in your Firebase project settings under "Your apps" for the Web app.

### Step 3: Install Dependencies

#### Server Dependencies

From the `server` directory:

```bash
npm install # or yarn install
```

#### Client Dependencies

Open a new terminal, navigate to the `client` directory:

```bash
cd ../client
npm install # or yarn install
```

### Step 4: Run the Applications

#### Start the Server (Node.js Backend)

From the `server` directory:

```bash
npm run dev
```

You should see output indicating the server is running, typically on `http://localhost:3000`.

#### Start the Client (Angular/Ionic Frontend)

Open another terminal, navigate to the `client` directory:

```bash
npm start
```

This will launch the Angular development server. Once compiled, the application will be accessible in your browser at `http://localhost:4200`.

### Step 5: Verify Installation

Open your web browser and navigate to:

*   **Client**: `http://localhost:4200`
*   **Server API**: `http://localhost:3000` (You might see a simple message indicating the server is running, or a 404 for a base route).

You should see the DalatFlow application loaded, with the map interface visible and functionality available after authentication.

## 6. Usage

DalatFlow is designed to be intuitive. Here's how to get started:

### Authenticate (Login & Register)

1.  Upon launching the app, you'll be prompted to **"Login"** or **"Sign Up"**.
2.  You can register with your email and password or use third-party providers like Google or Facebook (if configured).
3.  Once authenticated, you'll gain access to all features.

### Explore the Interactive Map

1.  The main screen displays an interactive map of Da Lat.
2.  **Click on markers** to view details about various tourist attractions.
3.  Use the **search bar** to find specific places or filter by category.
4.  **Zoom in/out** using your mouse scroll wheel or pinch gestures on mobile to explore different areas.

### Create an AI-Powered Itinerary

1.  Navigate to the **"Create Itinerary"** section (often indicated by a `+` button or a specific tab).
2.  Provide your preferences:
    *   **Departure Date**: When you plan to start your trip.
    *   **Duration**: How many days you plan to travel.
    *   **Interests**: Select tags that represent your preferences (e.g., "Nature," "Culture," "Adventure," "Food," "Relaxation").
    *   **Number of People**: The size of your travel group.
    *   **Budget**: Your preferred spending level (e.g., "Low," "Medium," "High").
3.  Click the **"Generate with AI"** button. The AI will process your inputs to suggest an optimized itinerary.
4.  **Review and Edit**: The generated itinerary will be displayed. You can review the suggested places, order, and times. Feel free to make adjustments to tailor it further.
5.  **Save Itinerary**: Once satisfied, save your itinerary for future access.

### Manage Your Saved Itineraries

1.  Go to the **"My Itineraries"** or **"Saved Trips"** section.
2.  **View**: Click on any saved itinerary to see its detailed breakdown, including daily plans and locations on a map.
3.  **Edit**: Modify existing itineraries to add, remove, or reorder places and adjust timings.
4.  **Delete**: Remove itineraries you no longer need.
5.  **Share**: Generate a shareable link to send your itinerary to friends and family.
6.  **Export**: Download your itinerary in formats like PDF or Excel for offline use or printing.

## 7. Contributing

We welcome contributions to DalatFlow! If you'd like to contribute, please follow these guidelines:

1.  **Fork** the repository on GitHub.
2.  **Clone** your forked repository to your local machine.
3.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-amazing-feature
    # or
    git checkout -b bugfix/resolve-issue-xyz
    ```
4.  **Make your changes** and ensure they adhere to the project's coding standards.
5.  **Test your changes** thoroughly.
6.  **Commit your changes** with a clear and descriptive message:
    ```bash
    git commit -m 'feat: Add amazing feature'
    # or
    git commit -m 'fix: Resolve issue with itinerary display'
    ```
7.  **Push your branch** to your forked repository:
    ```bash
    git push origin feature/your-amazing-feature
    ```
8.  **Open a Pull Request** against the `main` branch of the original DalatFlow repository, describing your changes in detail.

Thank you for your interest in making DalatFlow better!
