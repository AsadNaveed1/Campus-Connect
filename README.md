# Campus Connect

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

Campus Connect is an essential app for engaging with student societies and campus life. It offers QR code scanning, customizable profiles, and easy event updates to enhance the university experience. Explore societies, shop for merch, and stay informed about events—all in one place!

---

## 📑 Table of Contents

- [Screenshots](#screenshots)
- [Features](#📱-features)
  - [For Students](#for-students)
  - [For Society Admins](#for-society-admins)
- [Getting Started](#🚀-getting-started)
- [Testing the App](#📲-testing-the-app)
- [Technologies Used](#🛠️-technologies-used)
- [Database Structure](#database-structure)
- [License](#📄-license)

---

## Screenshots

<table align="center">
  <tr>
    <td align="center">
      <strong>Login</strong><br>
      <img src="docs/images/Img1.png" alt="Login Screen" width="300">
    </td>
    <td align="center">
      <strong>Home</strong><br>
      <img src="docs/images/Img2.png" alt="Home Screen" width="300">
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Societies</strong><br>
      <img src="docs/images/Img3.png" alt="Societies Screen" width="300">
    </td>
    <td align="center">
      <strong>Manage Society</strong><br>
      <img src="docs/images/Img4.png" alt="Manage Society Screen" width="300">
    </td>
  </tr>
</table>

---

## 📱 Features

### For Students
- **Society Discovery**: Browse and join campus societies organized by categories
- **Event Management**: View upcoming events, join events, and receive notifications
- **Personalized Feed**: See posts from joined societies in a chronalized feed
- **Merchandise Store**: Browse and view society merchandise
- **Smart Recommendations**: Shake your device to discover random societies and events
- **QR Code Integration**: Scan QR codes to quickly access societies and events
- **Profile Management**: Customize your profile with degree, major, year, and bio

### For Society Admins
- **Society Management**: Edit society details, logo, and background images
- **Event Creation**: Create and manage society events with full details
- **Post Publishing**: Share updates and announcements with members
- **Merchandise Management**: Add and manage society merchandise listings

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android device or emulator with Expo Go app installed

### Installation and Setup Instructions  

1. **Clone the repository**
   ```bash
   git clone https://github.com/AsadNaveed1/Campus-Connect.git
   cd campus-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the App**  
   Ensure you are on the same network as your Android device, then run: 
   ```bash
   npx expo start
   ```

4. **Run in Expo Go**  
   - Make sure the app runs in **Expo Go**, not in development build mode.  
   - Open the **Expo Go** app on your Android device.  
   - Scan the QR code displayed in the terminal or the Expo web interface to load the app.  

---

## 📲 Testing the App

### User Login
- **Email:** test@email.com
- **Password:** password
- Alternatively, you can register as a new user

### Society Admin Login
- Select any society from the dropdown
- **Password:** password
- Note: Societies must be manually added to the Firebase database

---

## 🛠️ Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **Firebase** - Backend services
  - Authentication
  - Firestore Database
  - Cloud Storage
- **React Native Paper** - Material Design components
- **Expo Router** - File-based navigation
- **Expo Camera** - QR code scanning
- **Expo Sensors** - Accelerometer for shake detection
- **React Native QRCode SVG** - QR code generation

### Database Structure
The app expects the following Firestore collections:
- `users` - User profiles
- `societies` - Society information
- `events` - Event details
- `posts` - Society posts
- `merch` - Merchandise items
- `categories` - Society categories

---

## 📄 License

This project is licensed under the MIT License.