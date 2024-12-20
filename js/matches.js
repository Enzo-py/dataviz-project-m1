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
    // get club name from url 
    const team = urlParams.get('team');
    const matchesListElement = document.getElementById("matches-list");
    let allMatches = [];
    ["2023-2024", "2022-2023", "2021-2022"].forEach(season => {
        if (ctx.matches[season]) {
            allMatches = allMatches.concat(ctx.matches[season]);
        }
    });

    // Filter matches to only include those involving the specified team
    const teamMatches = allMatches.filter(match => 
        match.home_team_name === team || match.away_team_name === team
    );

    // Sort matches by date in descending order (newest first)
    teamMatches.sort((a, b) => new Date(b.date_GMT) - new Date(a.date_GMT));
    
    // Display matches
    matchesListElement.innerHTML = "";
    teamMatches.forEach((match, i) => {
        const row = document.createElement("tr");
        row.setAttribute("is-visible", "true");
        const homeScore = parseInt(match.home_team_goal_count);
        const awayScore = parseInt(match.away_team_goal_count);
        const currentTeam = urlParams.get('team');
        row.innerHTML = `
            <td>${match.date_GMT}</td>
            <td>${match.home_team_name}</td>
            <td>${homeScore} - ${awayScore}</td>
            <td>${match.away_team_name}</td>
        `;
        row.addEventListener('click', () => showMatchDetails(match));
        row.style.cursor = "pointer";
        row.addEventListener("click", () => {
            window.location.href = `matches.html?match=${match}&date=${match.date_GMT}&team=${currentTeam}`;
        });
        matchesListElement.appendChild(row);
        // d3.select(row).style("transform", "scale(0)").style("transform-origin", "top").style("transition", "none")
        //     .transition()
        //     .duration(500)
        //     .delay(i * 40)
        //     .style("transform", "scale(1.02)")
        //     .transition()
        //     .duration(200)
        //     .style("transform")
        //     .style("transition", "all 0.3s")
    });

    pagination(true);
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
                team2 = match.away_team_name;
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

    document.getElementById("team1-logo").addEventListener("click", () => {
        const team1 = team;
        if (team1) {
            window.location.href = `team_page.html?club=${encodeURIComponent(team1)}`;
        }
    });

    document.getElementById("team2-logo").addEventListener("click", () => {
        if (team2) {
            window.location.href = `team_page.html?club=${encodeURIComponent(team2)}`;
        }
    });
});

function goBackToAllMatches() {
    const team = urlParams.get('team');
    window.location.href = `matches.html?team=${encodeURIComponent(team)}`;
}
const urlParams = new URLSearchParams(window.location.search);


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

    home_score = d3.select(matchDetails).select(".home-score")
    away_score = d3.select(matchDetails).select(".away-score")

    nb_rd_home = Math.floor(Math.random() * 6)
    home_score.append("span").text(match.home_team_goal_count)
        .attr("class", "true-score")
        .style("position", "absolute")
        .style("transform", "translateY(100px)")
        .style("right", "0")
        .transition()
        .duration(900)
        .delay(800 * nb_rd_home)
        .style("transform", "translateY(-20px)")
        .transition()
        .duration(900)
        .style("transform", "translateY(0)")

    nb_rd_away = Math.floor(Math.random() * 5)
    away_score.append("span").text(match.away_team_goal_count)
        .attr("class", "true-score")
        .style("position", "absolute")
        .style("transform", "translateY(100px)")
        .style("left", "0")
        .transition()
        .duration(900)
        .delay(900 * nb_rd_away + 100)
        .style("transform", "translateY(-20px)")
        .transition()
        .duration(900)
        .style("transform", "translateY(0)")

    // create counter animation for score
    for (var i = 0; i < nb_rd_home; i++) {
        home_score.append("span").text(String(Math.floor(Math.random() * 7)))
            .style("position", "absolute")
            .style("transform", "translateY(100px)")
            .style("right", "0")
            .transition("ease-in-out")
            .duration(900 + i * 400)
            .delay(i * 800 - i * 20)
            .style("transform", "translateY(-100px)")
    }

    for (var i = 0; i < nb_rd_away; i++) {
        away_score.append("span").text(String(Math.floor(Math.random() * 7)))
            .style("position", "absolute")
            .style("transform", "translateY(100px)")
            .style("left", "0")
            .transition("ease-in-out")
            .duration(900 + i * 400 + 100)
            .delay(i * 800 - i * 20 + 150)
            .style("transform", "translateY(-100px)")
    }

    // matchDetails.querySelector('.home-score').textContent = match.home_team_goal_count;
    // matchDetails.querySelector('.away-score').textContent = match.away_team_goal_count;
    matchDetails.querySelector('.stadium').textContent = match.stadium_name;
    
    // Update half-time score
    matchDetails.querySelector('.home-ht').textContent = match.home_team_goal_count_half_time;
    matchDetails.querySelector('.away-ht').textContent = match.away_team_goal_count_half_time;

    // Update attendance
    matchDetails.querySelector('.attendance span').textContent = match.attendance || 'N/A';
    matchDetails.querySelector('.gameweek span').textContent = match["Game Week"] || 'N/A';
    matchDetails.querySelector('.referee span').textContent = match.referee || 'N/A';

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

    // animation
    d3.selectAll(".match-details .team-logo").style("transform", "scale(0)")
        .transition()
        .duration(500)
        .style("transform", "scale(1.02)")
        .transition()
        .duration(200)

    d3.selectAll(".match-details .stat-item").style("transform", "scale(0)").style("transform-origin", "top")
        .transition()
        .duration(500)
        .delay((d, i) => i * 180)
        .style("transform", "scale(1.02)")
        .transition()
        .duration(200)
}

function updateStatItem(grid, type, homeValue, awayValue) {
    const item = grid.querySelector(`[data-stat="${type}"]`);
    if (item) {
        item.querySelector('.home-value').textContent = homeValue;
        item.querySelector('.away-value').textContent = awayValue;
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

function pagination(animation) {
    var table = document.querySelector('table#matches-table');
    var rows = table.querySelectorAll('tr[is-visible="true"]');
    var rpp = 15 - 1; // rows per page
    var rows_length = rows.length;

    for (var i = 0; i < rows_length; i++) {
        if (i > rpp) {
            rows[i].style.display = 'none';
        }
    }

    var pageCount = Math.ceil((rows_length - 1) / rpp);
    var pagination = document.getElementById('pagination');

    // empty the pagination
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }

    for (var i = 0; i < pageCount; i++) {
        var page = document.createElement('span');
        if (i == 1) {
            dots_page = document.createElement('span');
            dots_page.innerHTML = '...';
            dots_page.style.display = 'none';
            dots_page.setAttribute('id', 'dots_page_start');
            dots_page.classList.add('dots_page');
            pagination.appendChild(dots_page);
        }
        if (i == pageCount - 1) {
            dots_page = document.createElement('span');
            dots_page.innerHTML = '...';
            dots_page.style.display = 'none';
            dots_page.setAttribute('id', 'dots_page_end');
            dots_page.classList.add('dots_page');
            pagination.appendChild(dots_page);
        }
        page.innerHTML = i + 1;
        page.setAttribute('id', 'page' + (i + 1));
        page.onclick = function () {
            var p = parseInt(this.innerHTML);

            // deselect all other pages and select the 3 pages around the current page
            for (var j = 1; j <= pageCount; j++) {
                if (j != p) {
                    document.getElementById('page' + j).removeAttribute('class');
                }

                if (j < p - 3 || j > p + 3) {
                    document.getElementById('page' + j).style.display = 'none';
                } else {
                    document.getElementById('page' + j).style.display = '';
                }
            }
            this.classList.add('selected');
            
            for (var j = 0; j < rows_length; j++) {
                if (j >= rpp * (p - 1) && j < rpp * p) {
                    rows[j].style.display = '';
                } else {
                    rows[j].style.display = 'none';
                }
            }

            // si la dernière page n'est pas afficher, on l'affiche ainsi que ...
            if (p < pageCount - 3) {
                document.getElementById('dots_page_end').style.display = '';
                document.getElementById('page' + pageCount).style.display = '';
            } else if (pageCount > 6) {
                document.getElementById('dots_page_end').style.display = 'none';
            }
            if (p > 4) {
                document.getElementById('dots_page_start').style.display = '';
                document.getElementById('page1').style.display = '';

            // vérifier s'il y  a suffisamment de pages pour afficher les ...
            } else if (pageCount > 6) {
                document.getElementById('dots_page_start').style.display = 'none';
            }
        }
        pagination.appendChild(page);
    }

    // select the first page
    if (document.getElementById('page1') != null) document.getElementById('page1').click();

    if (animation !== undefined && animation) {
        // anim visible tr sur la current page
        current_page_tr = d3.selectAll("tr[is-visible='true']").filter(function() {
            return this.style.display != 'none'
        })
        current_page_tr.each(function(d, i) {
            var tr = d3.select(this);
            delay = i;
            tr.style("transition", "none").style("transform", "scale(0)").style("transform-origin", "top").style("display", "none")
                .transition()
                .duration(500)
                .delay(delay * 40)
                .style("display", "")
                .style("transform", "scale(1.02)")
                .transition()
                .duration(200)
                .style("transform")
                .style("transition", "all 0.3s")
        });

        pagination = d3.select("#pagination")
        pagination.style("transform", "scale(0)").style("transform-origin", "left")
            .transition()
            .delay(100 * rpp + 400)
            .duration(300)
            .style("transform", "scale(1.04)")
            .transition()
            .duration(100)
            .style("transform")
    }
    
}

