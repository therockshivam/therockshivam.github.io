// Firebase Admin Authentication Module
import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

/**
 * Computes dashboard URL relative to current directory
 */
function getDashboardUrl() {
    return new URL("admin/dashboard.html", document.baseURI).href;
}

/**
 * Display inline error message in login UI
 */
function showError(message) {
    const banner = document.getElementById("error-banner");
    if (banner) {
        banner.textContent = message;
        banner.style.display = "block";
    }
}

function clearError() {
    const banner = document.getElementById("error-banner");
    if (banner) {
        banner.style.display = "none";
        banner.textContent = "";
    }
}

// Redirect immediately if already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Active admin session detected:", user.email);
        window.location.href = getDashboardUrl();
    }
});

// Handle Login Form Submit
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const submitBtn = document.getElementById("login-btn");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            clearError();

            const email = document.getElementById("admin-email")?.value.trim();
            const password = document.getElementById("admin-password")?.value;

            if (!email || !password) {
                showError("Please provide both email and password.");
                return;
            }

            const originalBtnText = submitBtn.textContent;

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = "Authenticating...";

                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("Logged in successfully:", userCredential.user.email);
                
                window.location.href = getDashboardUrl();
            } catch (error) {
                console.error("Login failed:", error.code, error.message);
                
                let friendlyMsg = "Authentication failed. Invalid email or password.";
                if (error.code === "auth/too-many-requests") {
                    friendlyMsg = "Too many failed attempts. Please try again later.";
                } else if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
                    friendlyMsg = "Invalid credentials. Please verify your admin email and password.";
                }
                
                showError(friendlyMsg);
                
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});