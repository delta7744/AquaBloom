# AquaBloom - Smart Irrigation Management

**Smart Water. Better Crops.** AquaBloom is an intelligent irrigation management system for farmers

## Features

- 🌱 Real-time sensor monitoring (soil moisture, temperature, humidity, pH)
- 🤖 AI-powered irrigation recommendations using Google Gemini
- 📊 Disease risk analysis
- 📱 Native mobile app (iOS & Android)
- 💧 Water savings tracking
- 📈 Historical data visualization

## Run Locally (Web)

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file and set your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser

## Build for Mobile App

AquaBloom is configured with **Capacitor** to run as a native mobile app on iOS and Android.

### Prerequisites for Mobile Development

- **For iOS:** macOS with Xcode installed
- **For Android:** Android Studio with Android SDK installed

### Setup Mobile App

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Build the web app**:
   ```bash
   npm run build
   ```

3. **Initialize Capacitor platforms** (first time only):
   ```bash
   npx cap add ios
   npx cap add android
   ```

4. **Sync web assets to native projects**:
   ```bash
   npm run mobile:sync
   ```

### Running on iOS

```bash
npm run mobile:ios
```

This will:
- Build the web app
- Sync to iOS project
- Open Xcode where you can run on simulator or device

### Running on Android

```bash
npm run mobile:android
```

This will:
- Build the web app
- Sync to Android project
- Open Android Studio where you can run on emulator or device

### Mobile Build Scripts

- `npm run mobile:build` - Build web app and sync to native projects
- `npm run mobile:ios` - Build, sync, and open iOS project in Xcode
- `npm run mobile:android` - Build, sync, and open Android project in Android Studio
- `npm run mobile:sync` - Sync web assets to native projects (use after making changes)

### Publishing to App Stores

1. **iOS (App Store)**:
   - Open `ios/App/App.xcworkspace` in Xcode
   - Configure signing and certificates
   - Archive and submit via Xcode

2. **Android (Google Play)**:
   - Open `android` folder in Android Studio
   - Build a release APK/AAB
   - Submit to Google Play Console

## Project Structure

```
├── components/       # Reusable UI components
├── views/           # Main app views (Dashboard, History, etc.)
├── services/        # API and AI services
├── backend/         # Express.js backend server
├── types.ts         # TypeScript type definitions
└── capacitor.config.ts  # Capacitor mobile app configuration
```

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Mobile:** Capacitor 6
- **AI:** Google Gemini API
- **Backend:** Express.js + MongoDB + MQTT (IoT)

## Environment Variables

Create a `.env.local` file in the root directory:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## License

Private - All rights reserved
