# Firebase Setup & Deployment Guide for Shivam's Vault

This guide details the step-by-step procedure for setting up Firebase for **Shivam's Vault** portfolio hosted on GitHub Pages.

---

## 1. Firebase Project Creation
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name your project (e.g., `therockshivam-portfolio`).
3. Click **Continue** (Google Analytics optional).
4. Click **Create Project**.

---

## 2. Register Web App & Obtain Config
1. In your Firebase Project Overview, click the **Web icon (`</>`)** to add a web application.
2. App nickname: `Shivam Vault Web App`.
3. Do **NOT** check "Firebase Hosting".
4. Click **Register App**.
5. Copy the `firebaseConfig` object and place it in `js/firebase-config.js` or set `window.FIREBASE_CONFIG` in your HTML header.

---

## 3. Enable Firebase Authentication (Email/Password)
1. In Firebase Console sidebar, navigate to **Build → Authentication**.
2. Click **Get Started**.
3. Under **Sign-in method**, click **Email/Password**.
4. Enable **Email/Password** (leave Email link passwordless disabled).
5. Click **Save**.
6. Go to the **Users** tab and click **Add User**:
   - **Email**: Enter your admin email (e.g., `shivam@example.com`)
   - **Password**: Enter a strong admin password.
   - Note down these credentials—this is your primary login for `/admin/index.html`.

---

## 4. Enable Cloud Firestore Database
1. Navigate to **Build → Firestore Database**.
2. Click **Create Database**.
3. Location: Choose a region close to your primary audience (e.g., `us-central` or `asia-south1`).
4. Security Rules: Select **Production Mode** (do not select Test Mode).
5. Click **Create**.
6. Go to the **Rules** tab in Firestore:
   - Copy the contents of `firestore.rules` from this repository and paste them into the Firestore Rules editor.
   - Click **Publish**.

---

## 5. Enable Firebase Storage
1. Navigate to **Build → Storage**.
2. Click **Get Started**.
3. Choose **Production Mode** and select your location.
4. Go to the **Rules** tab in Storage:
   - Copy the contents of `storage.rules` from this repository and paste them into the Storage Rules editor.
   - Click **Publish**.

---

## 6. Configure Firebase App Check (Optional Abuse Protection)
1. Navigate to **Build → App Check**.
2. Click **Register App**.
3. Select **reCAPTCHA v3** or **reCAPTCHA Enterprise**.
4. Register your domain: `therockshivam.github.io` and `localhost` / `127.0.0.1` for testing.
5. Copy the reCAPTCHA Site Key into `window.RECAPTCHA_SITE_KEY` in `index.html`.

---

## 7. Local Testing & GitHub Pages Deployment
1. **Local Test**: Run any static server (e.g., VS Code Live Server or `npx http-server`).
2. **Access Admin Portal**: Open `http://localhost:5500/admin/index.html`.
3. **Log in**: Enter the admin email and password created in Step 3.
4. **Publish Portfolio Data**: Create your initial projects, tools, and vault notes via the Admin Dashboard.
5. **Push to GitHub**: Commit files to your GitHub repository and push to your `main` branch. GitHub Pages will build automatically with zero backend dependencies!
