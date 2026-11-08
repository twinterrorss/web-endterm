function renderGames(games) {
    const container = document.getElementById("games");
    const counter = document.getElementById("games-count");

    container.replaceChildren();

    games.forEach((game) => {
        const column = document.createElement("div");
        column.className = "col-12 col-sm-6 col-lg-3";

        const card = document.createElement("article");
        card.className = "slot-card h-100";
        card.dataset.gameId = game.id;

        if (game.featured) {
            card.classList.add("highlighted");
        }

        const art = document.createElement("div");
        art.className = "slot-art";

        const image = document.createElement("img");
        image.src = game.image;
        image.alt = game.alt;
        image.className = "img-fluid";
        image.width = 320;
        image.height = 240;
        image.loading = "lazy";

        const title = document.createElement("h3");
        title.textContent = game.name;

        const subtitle = document.createElement("small");
        subtitle.textContent = game.subtitle;

        art.append(image);
        card.append(art, title, subtitle);
        column.append(card);
        container.append(column);
    });

    counter.textContent = `${games.length} featured games`;
}

function filterGames(query) {
    const searchText = query.trim().toLowerCase();

    return casinoGames.filter((game) => {
        return game.name.toLowerCase().includes(searchText);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    renderGames(casinoGames);
    const searchInput = document.getElementById("game-search");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value;

        const filteredGames = filterGames(query);

        renderGames(filteredGames);
    });
});
