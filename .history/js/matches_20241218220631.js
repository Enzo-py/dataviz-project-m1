const ctx = { data: {}, teams: {}, players: {}, matches: {} };

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
    const matchesListElement = document.getElementById("matches-list");
    let allMatches = [];
    ["2023-2024", "2022-2023", "2021-2022"].forEach(season => {
        if (ctx.matches[season]) {
            allMatches = allMatches.concat(ctx.matches[season]);
        }
    });

    allMatches.sort((a, b) => new Date(b.date_GMT) - new Date(a.date_GMT));
    
    // Display matches
    matchesListElement.innerHTML = "";
    allMatches.forEach(match => {
        const row = document.createElement("tr");
        const homeScore = parseInt(match.home_team_goal_count);
        const awayScore = parseInt(match.away_team_goal_count);
        row.innerHTML = `
            <td>${match.date_GMT}</td>
            <td>${match.home_team_name}</td>
            <td>${homeScore} - ${awayScore}</td>
            <td>${match.away_team_name}</td>
        `;
        row.addEventListener('click', () => showMatchDetails(match));
        matchesListElement.appendChild(row);
    });
}

// Helper function to get the team's league
function getTeamLeague(teamName, season) {
    let league = null;
    if (season === "All Seasons") {
        const seasons = ["2021-2022", "2022-2023", "2023-2024"];
        for (const s of seasons) {
            const teamData = ctx.teams[s]?.find(team => team.common_name === teamName);
            if (teamData) {
                const country = teamData.country.trim().toLowerCase();
                league = countryToLeague[country] || "Unknown League";
                break;
            }
        }
    } else {
        const teamData = ctx.teams[season]?.find(team => team.common_name === teamName);
        if (teamData) {
            const country = teamData.country.trim().toLowerCase();
            league = countryToLeague[country] || "Unknown League";
        }
    }
    return league;
}

document.addEventListener("DOMContentLoaded", function() {
    // Get parameters from link 
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('match');
    const date = urlParams.get('date');
    const team = urlParams.get('team');

    // Add loading screen
    document.getElementById("loading-screen").style.display = "flex";
    load_data().then(() => {
        // If we have a specific match to display
        if (matchId && date && team) {
            let allMatches = [];
            Object.values(ctx.matches).forEach(seasonMatches => {
                allMatches = allMatches.concat(seasonMatches);
            });
            
            // Find the specific match
            const match = allMatches.find(m => 
                (m.home_team_name === team || m.away_team_name === team) && 
                m.date_GMT === date
            );
            
            if (match) {
                showMatchDetails(match);
                // Hide the matches list since we're showing a specific match
                document.querySelector('.matches').style.display = 'none';
            }
        } else {
            // Show all matches if no specific match is requested
            updateMatchesList();
            document.querySelector('.matches').style.display = 'block';
            document.querySelector('.match-details').style.display = 'none';
        }

        // Hide the loading screen
        document.getElementById("loading-screen").style.display = "none";
    });
});


function showMatchDetails(match) {
    const matchDetails = document.querySelector('.match-details');
    matchDetails.style.display = 'block';

    // Update team logos
    const homeLogo = matchDetails.querySelector('.home-team .team-logo');
    const awayLogo = matchDetails.querySelector('.away-team .team-logo');
    homeLogo.src = ctx.logos[match.home_team_name] || '';
    awayLogo.src = ctx.logos[match.away_team_name] || '';

    // Update team names
    matchDetails.querySelector('.home-team .team-name').textContent = match.home_team_name;
    matchDetails.querySelector('.away-team .team-name').textContent = match.away_team_name;

    // Update score and match info
    matchDetails.querySelector('.date').textContent = match.date_GMT;
    matchDetails.querySelector('.home-score').textContent = match.home_team_goal_count;
    matchDetails.querySelector('.away-score').textContent = match.away_team_goal_count;
    matchDetails.querySelector('.stadium').textContent = match.stadium_name;

    // Update possession bar
    const possessionBar = matchDetails.querySelector('.possession-bar');
    possessionBar.style.setProperty('--home-possession', `${match.home_team_possession}%`);
    possessionBar.setAttribute('title', `Possession: ${match.home_team_possession}% - ${match.away_team_possession}%`);

    // Update stats
    const statsGrid = matchDetails.querySelector('.stats-grid');
    updateStatItem(statsGrid, 'shots', match.home_team_shots, match.away_team_shots);
    updateStatItem(statsGrid, 'shots_on_target', match.home_team_shots_on_target, match.away_team_shots_on_target);
    updateStatItem(statsGrid, 'shots_off_target', match.home_team_shots_off_target, match.away_team_shots_off_target);
    updateStatItem(statsGrid, 'corners', match.home_team_corner_count, match.away_team_corner_count);
    updateStatItem(statsGrid, 'fouls', match.home_team_fouls, match.away_team_fouls);
    updateStatItem(statsGrid, 'yellow_cards', match.home_team_yellow_cards, match.away_team_yellow_cards);
    updateStatItem(statsGrid, 'red_cards', match.home_team_red_cards, match.away_team_red_cards);
    updateStatItem(statsGrid, 'xg', match.team_a_xg, match.team_b_xg);

    // Clear and update goal timings
    document.querySelector('.home-goals').innerHTML = '';
    document.querySelector('.away-goals').innerHTML = '';
    updateGoalTimings('home-goals', match.home_team_goal_timings);
    updateGoalTimings('away-goals', match.away_team_goal_timings);

    // Update possession percentages
    matchDetails.querySelector('.home-possession').textContent = `${match.home_team_possession}%`;
    matchDetails.querySelector('.away-possession').textContent = `${match.away_team_possession}%`;
}

function updateStatItem(grid, type, homeValue, awayValue) {
    const item = grid.querySelector(`[data-stat="${type}"]`);
    if (item) {
        item.querySelector('.home-value').textContent = homeValue;
        item.querySelector('.away-value').textContent = awayValue;
    }
}

function updateCards(containerClass, yellowCount, redCount) {
    const container = document.querySelector(`.${containerClass}`);
    container.innerHTML = ''; // Clear existing cards
    for (let i = 0; i < yellowCount; i++) {
        const card = document.createElement('div');
        card.className = 'card yellow';
        container.appendChild(card);
    }
    for (let i = 0; i < redCount; i++) {
        const card = document.createElement('div');
        card.className = 'card red';
        container.appendChild(card);
    }
}

function updateGoalTimings(containerClass, timings) {
    if (!timings || timings === '0') return;
    
    const container = document.querySelector(`.${containerClass}`);
    const times = timings.split(',').map(t => parseInt(t.trim()));
    
    times.forEach(time => {
        const goal = document.createElement('div');
        goal.className = 'goal-time';
        goal.textContent = `${time}'`;
        container.appendChild(goal);
    });
}



