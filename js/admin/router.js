const Router = {

    init() {

        document.querySelectorAll(".menu").forEach(menu => {

            menu.addEventListener("click", () => {

                document
                    .querySelectorAll(".menu")
                    .forEach(x => x.classList.remove("active"));

                menu.classList.add("active");

                const page = menu.dataset.page;

                switch(page){

                    case "dashboard":

                        UI.loadDashboard();

                        break;

                    case "database":

                        UI.loadDatabase();

                        break;

                    case "settings":

                        UI.loadSettings();

                        break;

                }

            });

        });

    }

};