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
        // image.loading = "lazy";

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

function filterGames(query, category) {
    const searchText = query.trim().toLowerCase();

    return casinoGames.filter((game) => {
        const matchesSearch = game.name
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
            category === "All" || game.category === category;

        return matchesSearch && matchesCategory;
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("game-search");

    const categoryButtons = document.querySelectorAll(".category-btn");

    let selectedCategory = "All";

    function updateGames() {
        const query = searchInput.value;

        const filteredGames = filterGames(query, selectedCategory);

        renderGames(filteredGames);
    }

    searchInput.addEventListener("input", updateGames);

    for (const button of categoryButtons) {
        button.addEventListener("click", () => {
            selectedCategory = button.dataset.category;

            for (const item of categoryButtons) {
                const isSelected = item.dataset.category === selectedCategory;

                item.classList.toggle("active", isSelected);
                // item.setAttribute("aria-pressed", String(isSelected));
            }

            updateGames();
        });
    }

    updateGames();
});
