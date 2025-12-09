# 🚀 Quick Start Guide - How to Run AquaBloom

## Option 1: Run as Web App (Easiest - Recommended)

### Step 1: Install Dependencies
```bash
npm install
```

**Note:** If you get a "no space left on device" error, you need to free up disk space first.

### Step 2: Create Environment File
Create a file named `.env.local` in the root directory with:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get a Gemini API Key:**
1. Go to https://aistudio.google.com/apikey
2. Create a new API key
3. Copy it into `.env.local`

### Step 3: Run the App
```bash
npm run dev
```

### Step 4: Open in Browser
Open your browser and go to: **http://localhost:3000**

---

## Option 2: Run as Mobile App (iOS/Android)

### Prerequisites
- **For iOS:** macOS with Xcode installed
- **For Android:** Windows/Mac/Linux with Android Studio installed

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local`** (same as Option 1)

3. **Build the app:**
   ```bash
   npm run build
   ```

4. **Add mobile platform:**
   ```bash
   # For iOS (macOS only)
   npx cap add ios
   
   # For Android
   npx cap add android
   ```

5. **Open in native IDE:**
   ```bash
   # iOS
   npm run mobile:ios
   
   # Android
   npm run mobile:android
   ```

6. **Run from Xcode (iOS) or Android Studio (Android)**

---

## Troubleshooting

### "No space left on device"
- Free up disk space on your C: drive
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and try again: `rm -rf node_modules && npm install`

### "GEMINI_API_KEY not found"
- Make sure `.env.local` exists in the root directory
- Check that the file contains: `GEMINI_API_KEY=your_key_here`
- Restart the dev server after creating the file

### Port 3000 already in use
- Change the port in `vite.config.ts` or kill the process using port 3000

---

## What You'll See

Once running, you'll see:
- **Welcome Screen** - Get started or login
- **Onboarding** - Set up your farm
- **Dashboard** - View sensor data and AI recommendations
- **History** - Past irrigation data
- **Community** - Connect with other farmers

---

## Need Help?

Check the main [README.md](README.md) for more detailed information.

