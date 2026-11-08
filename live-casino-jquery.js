$(document).ready(function () {
    $(".stream-card").each(function () {
        const card = $(this)
        const title = card.find("h3").text()

        const button = $("<button>", {
            type: "button",
            class: "preview-toggle",
            text: "More info",
            "aria-expaned": "false"
        })
        const details = $("<div>", {
            class: "preview-details"
        });

        details.text(
            `Information about "${title}". This is a demo preview. No live video is connected.`
        );
        card.append(button, details);
    })
    $("#streams").on("click", ".preview-toggle", function () {
        const button = $(this);
        const card = button.closest(".stream-card");
        const details = card.find(".preview-details");

        const isOpen = button.attr("aria-expanded") === "true";

        details.stop(true, true).slideToggle(200);

        button.attr("aria-expanded", String(!isOpen));
        button.text(isOpen ? "More info" : "Hide info");
    });



    $("#stream-search").on("input", function () {
        const query = $(this).val().trim().toLowerCase();

        let matches = 0;

        $(".stream-card").each(function () {
            const card = $(this);

            const title = card.find("h3").text().toLowerCase();

            const column = card.closest(".col-12");

            if (title.includes(query)) {
                column.stop(true, true).fadeIn(200);
                matches++;
            } else {
                column.stop(true, true).fadeOut(200);
            }
        });

        $("#no-stream-results").toggle(matches === 0);
    });
})