// Global variables and context initialization
const ctx = { data: {}, teams: {}, players: {}, matches: {} };

// Load data asynchronously
function load_data() {
    const teamPromises = fetch("teams.json").then(res => res.json()).then(data => ctx.teams = data);
    const playerPromises = fetch("players.json").then(res => res.json()).then(data => ctx.players = data);
    const matchesPromises = fetch("matches.json").then(res => res.json()).then(data => ctx.matches = data);

    Promise.all([...teamPromises, ...playerPromises, ...matchesPromises])
        .then(() => {
            updateTeamsList();
            loadClubLogos();
        })
        .catch(error => console.error("Error loading the data:", error));
}

// Update the list of teams
function updateTeamsList() {
    const teamsListElement = document.getElementById("teams-list");
    if (!teamsListElement || !ctx.teams) return;

    teamsListElement.innerHTML = Object.values(ctx.teams).flat().map(team => {
        return `<option value="${team.common_name}">${team.common_name}</option>`;
    }).join("");
}

// Update players list based on the selected team and season
function updatePlayersList(team1, season) {
    if (!ctx.players || !team1) return;

    const selectedSeason = season === "All Seasons" ? "2023-2024" : season;
    const players = ctx.players[selectedSeason]?.filter(player => player.team_name === team1) || [];

    players.sort((a, b) => Number(b.minutes_played_overall) - Number(a.minutes_played_overall));

    const playersListElement = document.getElementById("players-list");
    if (!playersListElement) return;
    playersListElement.innerHTML = players.map(player => {
        return `<li>${player.player_name} (${player.position}) - ${player.minutes_played_overall} mins</li>`;
    }).join("");
}

// Update matches list based on the selected team and season
function updateMatchesList(team1, season) {
    if (!ctx.matches || !team1) return;

    const selectedSeason = season === "All Seasons" ? "2023-2024" : season;
    const matches = [...(ctx.matches[selectedSeason]?.filter(match =>
        match.home_team_name === team1 || match.away_team_name === team1) || [])].reverse();

    const matchesListElement = document.getElementById("matches-list");
    if (!matchesListElement) return;
    matchesListElement.innerHTML = matches.map(match => {
        return `<li>${match.home_team_name} vs ${match.away_team_name} - ${match.date}</li>`;
    }).join("");
}

// Update stats based on the selected team and season
function updateStats(team1, season) {
    if (!ctx.teams || !team1) return;

    let data1;
    if (season === "All Seasons") {
        data1 = Object.keys(ctx.teams).reduce((acc, s) => {
            const teamData = ctx.teams[s].find(team => team.common_name === team1);
            if (teamData) acc.push(teamData);
            return acc;
        }, []);
    } else {
        data1 = ctx.teams[season]?.find(team => team.common_name === team1);
    }

    const country = data1 && data1.country ? data1.country.toLowerCase() : "";
    const league = countryToLeague[country] || "Unknown League";

    const statsElement = document.getElementById("team-stats");
    if (!statsElement) return;

    statsElement.innerHTML = data1 ? `
        <p>Team: ${data1.common_name}</p>
        <p>Country: ${data1.country}</p>
        <p>League: ${league}</p>
    ` : `<p>No stats available for ${team1}</p>`;
}

// Handle search input
function search(searchTerm) {
    const search = searchTerm.toLowerCase();
    const possibleCities = ctx.data["clubs_cities"]?.filter(d => d.City?.toLowerCase() === search) || [];
    const possibleClubs = ctx.data["clubs_cities"]?.filter(d => d.Club?.toLowerCase() === search) || [];

    console.log("Cities:", possibleCities);
    console.log("Clubs:", possibleClubs);
}

// Utility to clear HTML of an element
function clearElement(element) {
    if (element) element.innerHTML = "";
}

// Map countries to leagues
const countryToLeague = {
    "england": "Premier League",
    "spain": "La Liga",
    "italy": "Serie A",
    "france": "Ligue 1",
    "germany": "Bundesliga"
};
