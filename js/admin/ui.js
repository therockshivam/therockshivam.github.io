const UI = {

    loadDashboard() {

        document.getElementById("pageTitle").innerText = "Dashboard";

        document.getElementById("tableCount").innerText = "0";

        document.getElementById("recordCount").innerText = "0";

        document.getElementById("lastUpdated").innerText =
            new Date().toLocaleTimeString();

        Database.renderTables();

    },

    loadDatabase() {

        document.getElementById("pageTitle").innerText = "Database";

        Database.renderTables();

    },

    loadSettings() {

        document.getElementById("pageTitle").innerText = "Settings";

        document.getElementById("tableList").innerHTML = `
            <div class="table-card">
                <h3>Settings</h3>
                <p>Coming Soon...</p>
            </div>
        `;

    },

    showCreateTable(){

        alert("Create Table Screen Coming Soon");

    }

};