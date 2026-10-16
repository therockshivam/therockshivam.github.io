// Admin Dashboard Router Module
import { UI } from "./ui.js";

export const Router = {
    init() {
        document.querySelectorAll(".menu").forEach(menu => {
            menu.addEventListener("click", () => {
                document.querySelectorAll(".menu").forEach(x => x.classList.remove("active"));
                menu.classList.add("active");

                const page = menu.dataset.page;
                this.navigate(page);
            });
        });
    },

    navigate(page) {
        switch (page) {
            case "dashboard":
                UI.loadDashboard();
                break;
            case "projects":
                UI.loadProjects();
                break;
            case "tools":
                UI.loadTools();
                break;
            case "notes":
                UI.loadNotes();
                break;
            case "profile":
                UI.loadProfile();
                break;
            case "messages":
                UI.loadMessages();
                break;
            case "resume":
                UI.loadResumeEditor();
                break;
        }
    }
};