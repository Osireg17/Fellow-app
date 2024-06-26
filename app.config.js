import 'dotenv/config'

export default{
  "expo": {
    "name": "Fellow-App",
    "slug": "Fellow-App",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./photos/Landing-Logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "plugins": ["expo-apple-authentication"],
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.fellow.app",
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.fellow.app"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID
    }
  }
}
