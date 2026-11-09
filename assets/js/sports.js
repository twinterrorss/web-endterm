(function ($) {
  "use strict";

  var activeAlert;
  var alertTimer;
  var selectedSport;

  function showMessage(message, type) {
    var display = function () {
      activeAlert = $("<div>", {
        class: "sports-feedback alert alert-" + (type || "success"),
        role: "status",
        "aria-live": "polite",
        text: message
      }).hide().appendTo("body").fadeIn(180);
      alertTimer = window.setTimeout(hideMessage, 2400);
    };

    if (alertTimer) {
      window.clearTimeout(alertTimer);
    }
    if (activeAlert && activeAlert.length) {
      activeAlert.stop(true, true).fadeOut(180, function () {
        activeAlert.remove();
        display();
      });
      return;
    }
    display();
  }

  function hideMessage() {
    if (activeAlert && activeAlert.length) {
      activeAlert.stop(true, true).fadeOut(180, function () {
        activeAlert.remove();
        activeAlert = null;
      });
    }
  }

  function formatDate(value) {
    var date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  }

  function readSchedule() {
    try {
      var rows = JSON.parse(window.localStorage.getItem(window.cyberWinSports.storageKey) || "[]");
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      return [];
    }
  }

  function renderScheduleRow(row) {
    $("<tr>").append(
      $("<th>", { scope: "row", text: row.match }),
      $("<td>", { text: row.sport }),
      $("<td>", { text: formatDate(row.time) })
    ).appendTo(".schedule-table tbody");
  }

  function renderOdds(odds) {
    return $("<div>", { class: "odds" }).append(odds.map(function (odd, index) {
      return $("<span>", { tabindex: "0", role: "button", "aria-label": "Select outcome " + (index + 1) }).append(
        $("<em>", { text: ["1", "X", "2"][index] }),
        document.createTextNode(" " + odd)
      );
    }));
  }

  function renderSport(sport) {
    var data = window.cyberWinSports.sports[sport];
    selectedSport = sport;
    $(".sport-tabs span").removeClass("selected").attr("aria-selected", "false").filter(function () {
      return $(this).text().replace(/^[^A-Za-z0-9]+/, "").trim() === sport;
    }).addClass("selected").attr("aria-selected", "true");

    $(".hero-team.home > strong").text(data.hero);
    $(".hero-team.home .team-pill b").text(data.abbreviations[0]);
    $(".hero-team.home .team-pill em").text(data.teams[0]);
    $(".hero-team.away .team-pill b").text(data.abbreviations[1]);
    $(".hero-team.away .team-pill em").text(data.teams[1]);
    $(".hero-score strong").text(data.score);

    var live = $("#live-matches");
    live.find(".live-card").remove();
    data.live.forEach(function (match) {
      var card = $("<div>", { class: "live-card" }).append(
        $("<div>", { class: "live-teams" }).append(
          $("<span>").append($("<b>", { text: match[0].slice(0, 3).toUpperCase() }), document.createTextNode(" " + match[0])),
          $("<span>").append($("<b>", { text: match[1].slice(0, 3).toUpperCase() }), document.createTextNode(" " + match[1])),
          $("<small>", { text: sport.toUpperCase() })
        ),
        $("<span>", { class: "tiny-live", text: "LIVE" }),
        $("<span>", { class: "current-score", text: match[2] }),
        renderOdds(match[3])
      );
      live.append(card);
    });
    live.find(".section-title h2 b").text(data.live.length + " LIVE");

    var fixtures = $(".upcoming .fixture-list").empty();
    data.fixtures.forEach(function (match) {
      fixtures.append($("<div>", { class: "fixture" }).append(
        $("<span>", { class: "club" }).append($("<b>", { text: match[0].slice(0, 3).toUpperCase() }), document.createTextNode(" " + match[0])),
        $("<span>", { text: "vs" }),
        $("<span>", { class: "club" }).append($("<b>", { text: match[1].slice(0, 3).toUpperCase() }), document.createTextNode(" " + match[1])),
        $("<em>", { text: match[2] }),
        $("<small>", { text: match[3] }),
        $("<span>", { class: "fixture-odds" }).append(["1.85", "3.40", "1.95"].map(function (odd) {
          return $("<i>", { tabindex: "0", role: "button", text: odd });
        }))
      ));
    });
    $(".upcoming .section-title h2 b").text(data.fixtures.length + " MATCHES");
  }

  function updateBetSlip(choice) {
    var slip = $(".bet-slip");
    var card = choice.closest(".live-card, .fixture");
    var teams = card.find(".live-teams span, .club").map(function () {
      return $(this).text().trim().replace(/^[A-Z0-9]{1,3}\s+/, "");
    }).get();
    var oddValues = choice.text().match(/\d+(?:\.\d+)?/g) || ["0"];
    var odd = Number.parseFloat(oddValues[oddValues.length - 1]);
    var stake = Number.parseFloat(slip.find(".bet-stake").val());
    if (!Number.isFinite(stake) || stake < 1) {
      stake = 50;
      slip.find(".bet-stake").val("50");
    }
    slip.find(".bet-choice strong").first().text(teams.slice(0, 2).join(" vs "));
    slip.find(".bet-choice strong").eq(1).text("Outcome " + (choice.index() + 1) + " to win");
    slip.find(".bet-slip-odds").text(odd.toFixed(2));
    slip.find(".bet-slip-stake").text("$" + stake.toFixed(2));
    slip.find(".bet-slip-potential").text("$" + (stake * odd).toFixed(2));
    slip.find(".side-title b").text("1 ACTIVE");
    slip.find("button").prop("disabled", false).text("PLACE BET");
  }

  $(function () {
    if (!window.cyberWinSports) return;
    selectedSport = $(".sport-tabs .selected").text().replace(/^[^A-Za-z0-9]+/, "").trim();
    readSchedule().forEach(renderScheduleRow);
    $(".sport-tabs span").each(function () {
      $(this).attr({ tabindex: "0", role: "button", "aria-selected": $(this).hasClass("selected") });
    });
    $(".sport-tabs").on("click keydown", "span", function (event) {
      if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      var sport = $(this).text().replace(/^[^A-Za-z0-9]+/, "").trim();
      renderSport(sport);
      showMessage(sport + " selected. Matches updated.");
    });
    renderSport(selectedSport);
    $("#live-matches, .upcoming").on("click keydown", ".odds > span, .fixture-odds > i", function (event) {
      if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      $(this).siblings().removeClass("chosen");
      $(this).addClass("chosen");
      updateBetSlip($(this));
      showMessage("Selection added to your bet slip.");
    });
    $(".bet-slip").each(function () {
      var slip = $(this);
      slip.find("dd").eq(0).addClass("bet-slip-stake").text("$50.00");
      slip.find("dd").eq(1).addClass("bet-slip-odds");
      slip.find("dd").eq(2).addClass("bet-slip-potential");
      $("<label>", { class: "bet-stake-label", text: "Stake" }).append(
        $("<input>", { class: "form-control form-control-sm bet-stake", type: "number", min: "1", max: "10000", step: "0.01", value: "50", "aria-label": "Bet stake" })
      ).insertBefore(slip.find(".bet-choice"));
    });
    $(".bet-slip").on("input", ".bet-stake", function () {
      var slip = $(this).closest(".bet-slip");
      var stake = Math.max(1, Number.parseFloat($(this).val()) || 1);
      var odds = Number.parseFloat(slip.find(".bet-slip-odds").text()) || 0;
      $(this).val(stake);
      slip.find(".bet-slip-stake").text("$" + stake.toFixed(2));
      slip.find(".bet-slip-potential").text("$" + (stake * odds).toFixed(2));
    }).on("click", "button", function () {
      if ($(this).prop("disabled")) return;
      $(this).prop("disabled", true).text("BET PLACED");
      showMessage("Demo bet placed successfully.");
    });
    $(".schedule-form").on("submit", function (event) {
      event.preventDefault();
      var form = $(this);
      var row = { match: form.find("[name='match']").val().trim(), sport: form.find("[name='sport']").val(), time: form.find("[name='time']").val() };
      if (!row.match || !row.time) {
        showMessage("Please complete all schedule fields.", "danger");
        return;
      }
      var rows = readSchedule();
      rows.push(row);
      window.localStorage.setItem(window.cyberWinSports.storageKey, JSON.stringify(rows));
      renderScheduleRow(row);
      form[0].reset();
      showMessage("Match added to your schedule.");
    });
  });
}(jQuery));
