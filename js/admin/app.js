// Application Entry Point

document.addEventListener("DOMContentLoaded", () => {
    App.init();
});

const App = {

    init() {

        console.log("Portfolio Admin Started");

        Router.init();

        UI.loadDashboard();

        this.bindEvents();

    },

    bindEvents() {

        document
            .getElementById("refreshBtn")
            ?.addEventListener("click", () => {

                UI.loadDashboard();

            });

        document
            .getElementById("logoutBtn")
            ?.addEventListener("click", () => {

                Auth.logout();

            });

        document
            .getElementById("createTableBtn")
            ?.addEventListener("click", () => {

                UI.showCreateTable();

            });

    }

};