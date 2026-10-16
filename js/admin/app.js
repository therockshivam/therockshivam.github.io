// Application Entry Point for Admin Dashboard
import { AdminAuth } from "./auth.js";
import { Router } from "./router.js";
import { UI } from "./ui.js";

const App = {
    init() {
        console.log("Initializing Portfolio Admin Panel...");

        // Guard Admin route with Firebase Auth
        AdminAuth.initGuard((user) => {
            this.onAuthenticated(user);
        });
    },

    onAuthenticated(user) {
        const emailBadge = document.getElementById("userEmailBadge");
        if (emailBadge) {
            emailBadge.textContent = `Logged in as ${user.email}`;
        }

        const avatarImg = document.getElementById("adminAvatar");
        if (avatarImg) {
            avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`;
        }

        Router.init();
        UI.loadDashboard();
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById("refreshBtn")?.addEventListener("click", () => {
            const activeMenu = document.querySelector(".menu.active");
            const page = activeMenu?.dataset?.page || "dashboard";
            Router.navigate(page);
        });

        document.getElementById("logoutBtn")?.addEventListener("click", () => {
            AdminAuth.logout();
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    App.init();
});