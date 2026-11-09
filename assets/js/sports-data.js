"use strict";

// Demo data in the format expected by the existing sports.js.
function createSportData(teams, abbreviations, score, league) {
  return {
    hero: teams.join(" vs "),
    teams: teams,
    abbreviations: abbreviations,
    score: score,
    live: [[teams[0], teams[1], score, ["1.72", "3.40", "2.05"]]],
    fixtures: [[teams[0], teams[1], league, "Tomorrow · 18:00"]]
  };
}

window.cyberWinSports = {
  storageKey: storageKeys.schedule,
  sports: {
    "Football": createSportData(["Arsenal", "Chelsea"], ["A", "C"], "1 - 2", "PRO LEAGUE"),
    "Basketball": createSportData(["Lakers", "Celtics"], ["L", "C"], "82 - 76", "BASKETBALL LEAGUE"),
    "Hockey": createSportData(["Barys", "Spartak"], ["B", "S"], "2 - 1", "HOCKEY LEAGUE"),
    "Horse racing": createSportData(["Silver Arrow", "Golden Wind"], ["SA", "GW"], "Lap 2", "DEMO RACE"),
    "CS2": createSportData(["NAVI", "G2"], ["N", "G2"], "8 - 6", "BLAST PREMIER"),
    "Dota 2": createSportData(["Team Spirit", "PARIVISION"], ["TS", "PV"], "2 - 2", "DOTA 2 · TI 2027"),
    "League of Legends": createSportData(["T1", "Gen.G"], ["T1", "GG"], "1 - 1", "LEAGUE OF LEGENDS"),
    "Valorant": createSportData(["Fnatic", "Sentinels"], ["F", "S"], "9 - 7", "VCT MASTERS"),
    "Apex Legends": createSportData(["Falcons", "Alliance"], ["F", "A"], "24 - 20", "APEX LEAGUE"),
    "Overwatch 2": createSportData(["Team Falcons", "Crazy Raccoon"], ["TF", "CR"], "1 - 2", "OVERWATCH LEAGUE")
  }
};

// Keep the original featured fixtures from the two HTML pages.
window.cyberWinSports.sports.Football.fixtures = [
  ["Arsenal", "Barys", "PRO LEAGUE", "Tomorrow · 18:00"],
  ["Real Madrid", "Barcelona", "GRAND FINAL", "Tomorrow · 20:30"],
  ["Manchester United", "Spartak", "PRO LEAGUE", "25.09 · 16:30"],
  ["Aalen", "Spartak", "PRO LEAGUE", "30.09 · 20:30"],
  ["Boca Juniors", "Bayern Munich", "PRO LEAGUE", "30.09 · 21:30"]
];
window.cyberWinSports.sports["Dota 2"].live.push(
  ["Team Falcons", "BetBoom", "0 - 1", ["1.95", "3.10", "2.05"]]
);
window.cyberWinSports.sports["Dota 2"].fixtures = [
  ["Team Liquid", "BetBoom", "DOTA 2 · TI 2027", "Tomorrow · 18:00"],
  ["Team Yandex", "Xteam", "DOTA 2 · TI 2027", "Tomorrow · 20:30"]
];
