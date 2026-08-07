const Database = {

    tables: [

        {
            name:"projects",
            rows:8
        },

        {
            name:"skills",
            rows:14
        },

        {
            name:"blogs",
            rows:21
        },

        {
            name:"experience",
            rows:5
        }

    ],

    renderTables(){

        const container = document.getElementById("tableList");

        container.innerHTML = "";

        this.tables.forEach(table=>{

            container.innerHTML += `

                <div class="table-card">

                    <h3>📁 ${table.name}</h3>

                    <p>${table.rows} Records</p>

                    <div class="manage">

                        Manage →

                    </div>

                </div>

            `;

        });

        document.getElementById("tableCount").innerText =
            this.tables.length;

        document.getElementById("recordCount").innerText =
            this.tables.reduce((x,y)=>x+y.rows,0);

    }

};