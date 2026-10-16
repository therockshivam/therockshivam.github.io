// Admin Dashboard Auth Guard & Logout Module
import { auth } from "../firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

/**
 * Computes login page URL relative to document base
 */
function getLoginUrl() {
    return new URL("admin/index.html", document.baseURI).href;
}

export const AdminAuth = {
    currentUser: null,

    /**
     * Initializes Auth state listener to guard admin pages
     * @param {Function} onAuthenticatedCallback - Called when valid user session is verified
     */
    initGuard(onAuthenticatedCallback) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.currentUser = user;
                console.log("Admin session verified:", user.email);
                if (typeof onAuthenticatedCallback === "function") {
                    onAuthenticatedCallback(user);
                }
            } else {
                console.warn("Unauthenticated access attempt to Admin Dashboard. Redirecting...");
                window.location.href = getLoginUrl();
            }
        });
    },

    /**
     * Logs out current admin user safely
     */
    async logout() {
        if (confirm("Are you sure you want to log out of Portfolio CMS?")) {
            try {
                await signOut(auth);
                console.log("Logged out successfully.");
            } catch (err) {
                console.error("Sign out error:", err);
            } finally {
                window.location.href = getLoginUrl();
            }
        }
    }
};