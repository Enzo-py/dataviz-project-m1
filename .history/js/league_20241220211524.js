const ctx = { data: {}, teams: {}, players: {}, matches: {} };

const countryToLeague = {
    "england": "Premier League",
    "france": "Ligue 1",
    "germany": "Bundesliga",
    "italy": "Serie A",
    "spain": "La Liga"
};

let LEAGUE = "Bundesliga";

function loadClubLogos() {
    return d3.csv("data/clubs_logo.csv").then(data => {
        ctx.logos = {};
        data.forEach(d => {
            ctx.logos[d.Club.trim()] = d.Logo_URL;
        });
    }).catch(error => console.error("Error loading the club logos:", error));
}

function load_data() {
    const teamFiles = [
        "data/teams/england-2021-2022.csv",
        "data/teams/england-2022-2023.csv",
        "data/teams/england-2023-2024.csv",
        "data/teams/france-2021-2022.csv",
        "data/teams/france-2022-2023.csv",
        "data/teams/france-2023-2024.csv",
        "data/teams/germany-2021-2022.csv",
        "data/teams/germany-2022-2023.csv",
        "data/teams/germany-2023-2024.csv",
        "data/teams/italy-2021-2022.csv",
        "data/teams/italy-2022-2023.csv",
        "data/teams/italy-2023-2024.csv",
        "data/teams/spain-2021-2022.csv",
        "data/teams/spain-2022-2023.csv",
        "data/teams/spain-2023-2024.csv",
    ];

    const playerFiles = [
        "data/players/england-2021-2022.csv",
        "data/players/england-2022-2023.csv",
        "data/players/england-2023-2024.csv",
        "data/players/france-2021-2022.csv",
        "data/players/france-2022-2023.csv",
        "data/players/france-2023-2024.csv",
        "data/players/germany-2021-2022.csv",
        "data/players/germany-2022-2023.csv",
        "data/players/germany-2023-2024.csv",
        "data/players/italy-2021-2022.csv",
        "data/players/italy-2022-2023.csv",
        "data/players/italy-2023-2024.csv",
        "data/players/spain-2021-2022.csv",
        "data/players/spain-2022-2023.csv",
        "data/players/spain-2023-2024.csv",
    ];

    const matchesFiles = [
        "data/matches/england-2021-2022.csv",
        "data/matches/england-2022-2023.csv",
        "data/matches/england-2023-2024.csv",
        "data/matches/france-2021-2022.csv",
        "data/matches/france-2022-2023.csv",
        "data/matches/france-2023-2024.csv",
        "data/matches/germany-2021-2022.csv",
        "data/matches/germany-2022-2023.csv",
        "data/matches/germany-2023-2024.csv",
        "data/matches/italy-2021-2022.csv",
        "data/matches/italy-2022-2023.csv",
        "data/matches/italy-2023-2024.csv",
        "data/matches/spain-2021-2022.csv",
        "data/matches/spain-2022-2023.csv",
        "data/matches/spain-2023-2024.csv",
    ];

    const teamPromises = teamFiles.map(file => {
        return d3.csv(file).then(data => {
            const season = file.match(/(\d{4}-\d{4})/)[0];
            if (!ctx.teams[season]) ctx.teams[season] = [];
            ctx.teams[season] = ctx.teams[season].concat(data);
        });
    });

    const playerPromises = playerFiles.map(file => {
        return d3.csv(file).then(data => {
            const season = file.match(/(\d{4}-\d{4})/)[0];
            if (!ctx.players) ctx.players = {};
            if (!ctx.players[season]) ctx.players[season] = [];
            ctx.players[season] = ctx.players[season].concat(data);
        });
    });

    const matchesPromises = matchesFiles.map(file => {
        return d3.csv(file).then(data => {
            const season = file.match(/(\d{4}-\d{4})/)[0];
            if (!ctx.matches) ctx.matches = {};
            if (!ctx.matches[season]) ctx.matches[season] = [];
            ctx.matches[season] = ctx.matches[season].concat(data);
        });
    });

    return Promise.all([...teamPromises, ...playerPromises, ...matchesPromises])
        .then(() => {
            return loadClubLogos();
        })
        .catch(error => console.error("Error loading the data:", error));
}

document.addEventListener("DOMContentLoaded", function() {
    // Get parameters from link 
    const urlParams = new URLSearchParams(window.location.search);
    LEAGUE = urlParams.get('league');
    
    d3.select('h1').text(LEAGUE);

    if (!Object.values(countryToLeague).includes(LEAGUE)) {
        toast("error", "Invalid league parameter. Redirecting to the league 'Bundesliga'.");
        LEAGUE = "All Leagues";
    }

    // Add event listeners
    document.getElementById("season").addEventListener("change", function() {
        updateLeagueStats(); // Add this function call
    });


    d3.selectAll(".league-wrapper")
        .each(function() {
            const wrapper = d3.select(this);
            if (wrapper.attr("name") === LEAGUE) {
                wrapper.classed("active", true);
            }
        })
        .on("click", function() {
            const league = d3.select(this).attr("name");
            window.location.href = `league.html?league=${league}`;
        })
    // Add loading screen
    document.getElementById("loading-screen").style.display = "flex";
    load_data().then(() => {
        updateLeagueStats(); // Keep this function call
        updateTopTeams();     // Add this function call
        updateTopPlayers();   // Add this function call

        // Hide the loading screen
        document.getElementById("loading-screen").style.display = "none";
    });
});

// Function to update league tableloicone 
function updateLeagueStats() {
    const season = document.getElementById("season").value;
    let leagueTeams = [];

    if (season === "All Seasons") {
        // Handle 'All Seasons' selection
        document.getElementById("league-stats-body").innerHTML = `
            <tr>
                <td colspan="7">Please select a specific season to view league statistics.</td>
            </tr>`;
        return;
    }

    // Gather all teams for the selected season
    if (ctx.teams[season]) {
        leagueTeams = ctx.teams[season];
        if (LEAGUE !== "All Leagues") {
            leagueTeams = leagueTeams.filter(team => {
                const country = team.country.trim().toLowerCase();
                const teamLeague = countryToLeague[country];
                return teamLeague === LEAGUE;
            });
        }
    }

    // Sort teams based on league position
    leagueTeams.sort((a, b) => a.league_position - b.league_position);

    // Populate the league stats table
    const leagueStatsBody = document.getElementById("league-stats-body");
    leagueStatsBody.innerHTML = "";
    if (leagueTeams.length > 0) {
        leagueTeams.forEach(team => {
            const row = document.createElement("tr");
            console.log(team.wins);
            const points = (team.wins * 3 ) + parseInt(team.draws, 10) || 0;
            const goalDiff = (parseInt(team.goals_scored, 10) || 0) - (parseInt(team.goals_conceded, 10) || 0);
            row.innerHTML = `
                <td>${team.common_name}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td>${team.draws}</td>
                <td>${points}</td>
                <td>${team.goals_scored}</td>
                <td>${team.goals_conceded}</td>
                <td>${goalDiff}</td>
            `;
            leagueStatsBody.appendChild(row);
        });
    } else {
        leagueStatsBody.innerHTML = `
            <tr>
                <td colspan="7">No teams found for the selected league and season.</td>
            </tr>`;
    }
    updateTopTeams();
    updateTopPlayers();
}

function updateTopTeams() {
    const season = document.getElementById("season").value;
    let teams = [];

    if (ctx.teams[season]) {
        teams = ctx.teams[season];
        if (LEAGUE !== "All Leagues") {
            teams = teams.filter(team => {
                const country = team.country.trim().toLowerCase();
                const teamLeague = countryToLeague[country];
                return teamLeague === LEAGUE;
            });
        }
    }

    // Sort teams by points in descending order
    teams.sort((a, b) => b.points - a.points);
    teams.sort((a, b) => (b.goals_scored - b.goals_conceded) - (a.goals_scored - a.goals_conceded));

    // Get top 3 teams
    const topTeams = teams.slice(0, 3);

    // Populate the top teams list
    const topTeamsList = document.getElementById("top-teams-list");
    topTeamsList.innerHTML = "";

    topTeams.forEach(team => {
        const listItem = document.createElement("li");
        const points = (team.wins * 3 ) + parseInt(team.draws, 10) || 0;
        listItem.innerHTML = `
            <strong>${team.common_name}</strong> ${points} Points
        `;
        topTeamsList.appendChild(listItem);
    });
}

function updateTopPlayers() {
    const season = document.getElementById("season").value;
    let players = [];

    if (ctx.players[season]) {
        players = ctx.players[season];
        if (LEAGUE !== "All Leagues") {
            console.log()
            players = players.filter(player => {
                if (player.country) {
                    const country = player.country.trim().toLowerCase();
                    const playerLeague = countryToLeague[country];
                    return playerLeague === LEAGUE;
                }
                return false;
            });
        }
    }

    // Sort players by goals in descending order
    players.sort((a, b) => b.goals_overall - a.goals_overall);

    // Get top players (e.g., top 10)
    const topPlayers = players.slice(0, 10);

    // Populate the top players list
    const topPlayersList = document.getElementById("top-players-list");
    topPlayersList.innerHTML = "";

    topPlayers.forEach(player => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${player.player_name}</strong> (${player.club_name}) ${player.goals_overall} Goals
        `;
        topPlayersList.appendChild(listItem);
    });
}

