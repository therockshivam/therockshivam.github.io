import { supabase } from "./supabase.js";

const loginButton = document.getElementById("github-login-btn");

async function checkSession() {

    const { data } = await supabase.auth.getSession();

    if (data.session) {
        window.location.href = "dashboard.html";
    }
}

checkSession();

loginButton.addEventListener("click", async () => {

    await supabase.auth.signInWithOAuth({

        provider: "github",

        options: {
            redirectTo:
                window.location.origin +
                "/admin/dashboard.html"
        }

    });

});