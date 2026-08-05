document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});

async function initializeApp() {

    UI.initializePlayerModal();

    await Promise.all([
        loadLatestMovies(),
        loadLatestTVShows()
    ]);

}

/* ===========================
   MOVIES
=========================== */

async function loadLatestMovies() {

    UI.showMovieSkeleton("movieGrid");

    try {

        const response = await API.getLatestMovies();

        UI.renderMovies(
            "movieGrid",
            response.result,
            movie => {

                const playerUrl = API.moviePlayerUrl(movie);

                if (!playerUrl) {

                    alert("Player URL not found.");

                    return;
                }

                UI.openPlayer(playerUrl);

            }
        );

    } catch (e) {

        console.error(e);

        UI.showError(
            "movieGrid",
            "Unable to load latest movies."
        );

    }

}

/* ===========================
   TV SHOWS
=========================== */

async function loadLatestTVShows() {

    UI.showMovieSkeleton("tvGrid");

    try {

        const response = await API.getLatestTVShows();

        UI.renderMovies(
            "tvGrid",
            response.result,
            show => {

                const playerUrl = API.tvPlayerUrl(show);

                if (!playerUrl) {

                    alert("Player URL not found.");

                    return;
                }

                UI.openPlayer(playerUrl);

            }
        );

    } catch (e) {

        console.error(e);

        UI.showError(
            "tvGrid",
            "Unable to load latest TV Shows."
        );

    }

}