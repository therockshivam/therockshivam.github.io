const UI = (() => {

    function showMovieSkeleton(containerId, count = 10) {

        const container = document.getElementById(containerId);

        container.innerHTML = "";

        for (let i = 0; i < count; i++) {

            const skeleton = document.createElement("div");
            skeleton.className = "skeleton";

            container.appendChild(skeleton);

        }

    }

    function createMovieCard(movie, onClick) {

        const card = document.createElement("div");
        card.className = "movie-card";

        const poster = movie.poster ||
            "https://placehold.co/300x450/1b1b1b/ffffff?text=No+Image";

        const title =
            movie.title ||
            movie.show_title ||
            "Unknown";

        const year =
            movie.year ||
            "";

        card.innerHTML = `
            <img
                src="${poster}"
                alt="${title}"
                loading="lazy">

            <div class="movie-info">

                <h3>${title}</h3>

                <p>${year}</p>

            </div>
        `;

        card.addEventListener("click", () => {

            if (typeof onClick === "function") {
                onClick(movie);
            }

        });

        return card;

    }

    function renderMovies(containerId, movies, onClick) {

        const container = document.getElementById(containerId);

        container.innerHTML = "";

        if (!movies || movies.length === 0) {

            container.innerHTML =
                `<p style="color:#999">No movies found.</p>`;

            return;

        }

        movies.forEach(movie => {

            container.appendChild(
                createMovieCard(movie, onClick)
            );

        });

    }

    function showError(containerId, message) {

        document.getElementById(containerId).innerHTML =
            `
            <div style="
                padding:40px;
                text-align:center;
                color:#ff7070;
            ">
                ${message}
            </div>
            `;

    }

    function openPlayer(url) {

        const modal =
            document.getElementById("playerModal");

        const frame =
            document.getElementById("playerFrame");

        frame.src = url;

        modal.style.display = "block";

    }

    function closePlayer() {

        document.getElementById("playerModal").style.display = "none";

        document.getElementById("playerFrame").src = "";

    }

    function initializePlayerModal() {

        const closeButton =
            document.querySelector(".close");

        closeButton.addEventListener("click", closePlayer);

        window.addEventListener("click", (e) => {

            if (e.target.id === "playerModal") {

                closePlayer();

            }

        });

    }

    return {

        showMovieSkeleton,

        renderMovies,

        showError,

        openPlayer,

        closePlayer,

        initializePlayerModal

    };

})();