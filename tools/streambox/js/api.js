const API = (() => {

    const BASE_URL = "https://apiplayer.ru";

    const ENDPOINTS = {

        latestMovies: (page = 1) =>
            `${BASE_URL}/movies/latest/page-${page}.json`,

        latestTVShows: (page = 1) =>
            `${BASE_URL}/tvshows/latest/page-${page}.json`,

        latestEpisodes: (page = 1) =>
            `${BASE_URL}/episodes/latest/page-${page}.json`

    };

    async function request(url) {

        try {

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();

        } catch (error) {

            console.error("API Error:", error);

            return {
                result: [],
                page: 1,
                total_pages: 0
            };

        }

    }

    async function getLatestMovies(page = 1) {

        return await request(
            ENDPOINTS.latestMovies(page)
        );

    }

    async function getLatestTVShows(page = 1) {

        return await request(
            ENDPOINTS.latestTVShows(page)
        );

    }

    async function getLatestEpisodes(page = 1) {

        return await request(
            ENDPOINTS.latestEpisodes(page)
        );

    }

    function moviePlayerUrl(movie) {

        if (movie.embed_url_imdb)
            return BASE_URL + movie.embed_url_imdb;

        if (movie.embed_url_tmdb)
            return BASE_URL + movie.embed_url_tmdb;

        return null;

    }

    function tvPlayerUrl(show) {

        if (show.embed_url)
            return BASE_URL + show.embed_url;

        return null;

    }

    function episodePlayerUrl(episode) {

        if (episode.embed_url)
            return BASE_URL + episode.embed_url;

        return null;

    }

    return {

        getLatestMovies,
        getLatestTVShows,
        getLatestEpisodes,

        moviePlayerUrl,
        tvPlayerUrl,
        episodePlayerUrl

    };

})();