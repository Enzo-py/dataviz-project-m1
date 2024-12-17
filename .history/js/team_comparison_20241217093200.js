const countryToLeague = {
    "england": "Premier League",
    "france": "Ligue 1",
    "germany": "Bundesliga",
    "italy": "Serie A",
    "spain": "La Liga"
};

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

function updateTeamsList() {
    const season = document.getElementById("season").value;
    let teams = new Set();

    if (season === "All Seasons") {
        for (const s in ctx.teams) {
            ctx.teams[s].forEach(teamData => {
                teams.add(teamData.common_name); 
            });
        }
    } else {
        if (ctx.teams[season]) {
            ctx.teams[season].forEach(teamData => {
                teams.add(teamData.common_name); 
            });
        }
    }

    const datalist = document.getElementById("teams");
    datalist.innerHTML = ""; // Clear existing options
    teams.forEach(team => {
        const option = document.createElement("option");
        option.value = team;
        datalist.appendChild(option);
    });
}

function updateMatchesList() {
    const team1 = document.getElementById("team1").value;
    let season = document.getElementById("season").value;
    const matchesListElement = document.getElementById("matches-list");
    
    if (!team1) {
        matchesListElement.innerHTML = `
            <tr>
                <td colspan="5">Please select a team.</td>
            </tr>`;
        return;
    }

    let allMatches = [];
    if (season === "All Seasons") {
        // Combine matches from all seasons in reverse order
        ["2023-2024", "2022-2023", "2021-2022"].forEach(s => {
            if (ctx.matches[s]) {
                allMatches = allMatches.concat(
                    ctx.matches[s].filter(match =>
                        match.home_team_name === team1 || match.away_team_name === team1
                    )
                );
            }
        });
    } else if (ctx.matches[season]) {
        allMatches = ctx.matches[season].filter(match =>
            match.home_team_name === team1 || match.away_team_name === team1
        );
    }

    // Sort matches by date in descending order (newest first)
    allMatches.sort((a, b) => new Date(b.date_GMT) - new Date(a.date_GMT));
    matchesListElement.innerHTML = "";

    if (allMatches.length > 0) {
        allMatches.forEach(match => {
            const row = document.createElement("tr");
            const homeScore = parseInt(match.home_team_goal_count);
            const awayScore = parseInt(match.away_team_goal_count);
            let result = 'draw';
            
            if (match.home_team_name === team1) {
                if (homeScore > awayScore) result = 'win';
                else if (homeScore < awayScore) result = 'loss';
            } else {
                if (homeScore < awayScore) result = 'win';
                else if (homeScore > awayScore) result = 'loss';
            }


            row.innerHTML = `
                <td>${match.date_GMT}</td>
                <td>${match.home_team_name}</td>
                <td>${homeScore} - ${awayScore}</td>
                <td>${match.away_team_name}</td>
                <td class="${result}">${result.toUpperCase()}</td>
            `;
            matchesListElement.appendChild(row);
        });
    } else {
        matchesListElement.innerHTML = `
            <tr>
                <td colspan="5">No matches found for ${team1} ${season === "All Seasons" ? "in any season" : `in ${season}`}.</td>
            </tr>`;
    }
}

document.addEventListener("DOMContentLoaded", function() {
   // Get parameters from link 
    const urlParams = new URLSearchParams(window.location.search);
    const team1Param = urlParams.get('club');
    // Fill team1
    if (team1Param) {
        document.getElementById("team1").value = team1Param;
        updateTeamInfo("team1", team1Param);
    }
    // Add event listeners
    document.getElementById("team1").addEventListener("change", updateStats);
    document.getElementById("team2").addEventListener("change", updateStats);
    document.getElementById("season").addEventListener("change", function() {
        updateTeamsList();
        updateStats();
        updateMatchesList();
    });
    // Add loading screen
    document.getElementById("loading-screen").style.display = "flex";
    load_data().then(() => {
        if (teamParam) {
            const teamInput = document.getElementById("team1");
            teamInput.value = teamParam;
        }
        updateTeamsList();
        updateStats();
        updateMatchesList();

        // Hide the loading screen
        document.getElementById("loading-screen").style.display = "none";
    });


    function updateStats() {
        const team1 = document.getElementById("team1").value;
        const team2 = document.getElementById("team2").value;
        const season = document.getElementById("season").value;

        if (team1) {
            document.getElementById("team1-stats").innerHTML = `<h2>${team1} Stats (${season})</h2><p>Stats for ${team1} in ${season} will be displayed here.</p>`;
            const team1Logo = document.getElementById("team-logo");
            const team1NameElement = document.getElementById("team-name");
            const team1LeagueElement = document.getElementById("team-league");
            const logoURL1 = ctx.logos[team1];
            const team1RankElement= document.getElementById("team-rank");
            const team1RatioElement = document.getElementById("team-ratio");
        }

        if (team2) {
            document.getElementById("team2-stats").innerHTML = `<h2>${team2} Stats (${season})</h2><p>Stats for ${team2} in ${season} will be displayed here.</p>`;
            const team2Logo = document.getElementById("team-logo");
            const team2NameElement = document.getElementById("team-name");
            const team2LeagueElement = document.getElementById("team-league");
            const logoURL2 = ctx.logos[team1];
            const team2RankElement= document.getElementById("team-rank");
            const team2RatioElement = document.getElementById("team-ratio");
        }

        if (team1 && team2) {
            compareTeams(team1, team2, season);
        }
    }



    function getTeamLogo(teamName) {
        // Replace with actual logic to get the logo URL
        return "https://via.placeholder.com/150";
    }

    function compareTeams(team1, team2, season) {
        // Fetch and compare stats for team1 and team2
        const team1Stats = getTeamStats(team1, season);
        const team2Stats = getTeamStats(team2, season);

        const comparisonMetrics = [
            "wins", "losses", "draws", "goals_scored", "goals_conceded", "clean_sheets", "average_possession"
        ];

        let comparisonHtml = "<table><thead><tr><th>Metric</th><th>Team 1</th><th>Team 2</th></tr></thead><tbody>";

        comparisonMetrics.forEach(metric => {
            const team1Value = team1Stats[metric] || 0;
            const team2Value = team2Stats[metric] || 0;
            const highlightClass = team1Value > team2Value ? "highlight-team1" : team2Value > team1Value ? "highlight-team2" : "";

            comparisonHtml += `<tr class="${highlightClass}"><td>${metric}</td><td>${team1Value}</td><td>${team2Value}</td></tr>`;
        });

        comparisonHtml += "</tbody></table>";

        document.getElementById("team1-stats").innerHTML += comparisonHtml;
        document.getElementById("team2-stats").innerHTML += comparisonHtml;
    }

    function getTeamStats(team, season) {
        // Fetch team stats based on the team name and season
        // This is a placeholder function, replace with actual data fetching logic
        return {
            wins: Math.floor(Math.random() * 30),
            losses: Math.floor(Math.random() * 30),
            draws: Math.floor(Math.random() * 30),
            goals_scored: Math.floor(Math.random() * 100),
            goals_conceded: Math.floor(Math.random() * 100),
            clean_sheets: Math.floor(Math.random() * 20),
            average_possession: Math.floor(Math.random() * 100)
        };
    }
});
