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
    const team1Param = urlParams.get('club');
    // Fill team1
    if (team1Param) {
        document.getElementById("team1").value = team1Param;
    }
    // Add loading screen
    document.getElementById("loading-screen").style.display = "flex";
    load_data().then(() => {
        if (team1Param) {
            const team1Input = document.getElementById("team1");
            team1Input.value = team1Param;
        }
        // updateStats();
        updateMatchesList();

        // Hide the loading screen
        document.getElementById("loading-screen").style.display = "none";
    });


    // function updateStats() {
        // const team1 = document.getElementById("team1").value;
        // const team2 = document.getElementById("team2").value;
        // const season = document.getElementById("season").value;
        // let data1;
        // let data2;
        // let league1;
        // let league2;

        // if (team1) {
            
        //     document.getElementById("team1-stats").innerHTML = `<h2>${team1} Stats (${season})</h2><p>Stats for ${team1} in ${season} will be displayed here.</p>`;
        //     const team1Logo = document.getElementById("team1-logo");
        //     const team1Info = document.getElementById("team1-info");
        //     const logoURL1 = ctx.logos[team1];

        //     if (season === "All Seasons") {
        //         // Aggregate statistics from all seasons
        //         const seasons = ["2021-2022", "2022-2023", "2023-2024"];
        //         const teamDataArray = seasons
        //             .map(s => ctx.teams[s]?.find(team => team.common_name === team1))
        //             .filter(Boolean);
                

        //         // Initialize aggregated data
        //         data1 = aggregateTeamData(teamDataArray);
        //     } else if (ctx.teams[season]) {
        //         data1 = ctx.teams[season].find(team => team.common_name === team1);
        //     }
        //     if (logoURL1) {
        //         team1Logo.src = logoURL1;
        //         team1Logo.alt = `${team1} Logo`;
        //     } else {
        //         team1Logo.src = "";
        //         team1Logo.alt = "Logo not available";
        //     }

        //     // Update League
        //     const country1 = data1 && data1.length > 0 ? data1.country.toLowerCase() : data1 ? data1.country.toLowerCase() : "";
        //     league1 = countryToLeague[country1] || "Unknown League";
           
        //     // Update Rank
        //     if (season === "All Seasons") {
        //         rank1 = "Rank: N/A (All Seasons)";
        //     } else {
        //         const var1 = data1.league_position;
        //         rank1 = "Rank: " + var1;
        //     }
        //     // Update Team Ratio
        //     const wins =  data1.wins ;
        //     const losses = data1.losses;
        //     const draws = data1.draws ;
        //     const ratio = wins + "/" + losses + "/" + draws;
        //     team1Info.textContent = league1 + " | " + rank1 + " | "+ ratio;
                        
        // }

        // if (team2) {
        //     console.log("team2", data2);
        //     document.getElementById("team2-stats").innerHTML = `<h2>${team2} Stats (${season})</h2><p>Stats for ${team2} in ${season} will be displayed here.</p>`;
        //     const team2Logo = document.getElementById("team2-logo");
        //     const team2Info = document.getElementById("team2-info");
        //     const logoURL2 = ctx.logos[team2];

        //     if (season === "All Seasons") {
        //         // Aggregate statistics from all seasons
        //         const seasons = ["2021-2022", "2022-2023", "2023-2024"];
        //         const teamDataArray = seasons
        //             .map(s => ctx.teams[s]?.find(team => team.common_name === team2))
        //             .filter(Boolean);
                

        //         // Initialize aggregated data
        //         data2 = aggregateTeamData(teamDataArray);

        //     } else if (ctx.teams[season]) {
        //         data2 = ctx.teams[season].find(team => team.common_name === team2);
        //     }

        //     if (logoURL2) {
        //         team2Logo.src = logoURL2;
        //         team2Logo.alt = `${team2} Logo`;
        //     } else {
        //         team2Logo.src = "";
        //         team2Logo.alt = "Logo not available";
        //     }
        //     // Update League
        //     const country2 = data2 && data2.length > 0 ? data2.country.toLowerCase() : data2 ? data2.country.toLowerCase() : "";
        //     league2 = countryToLeague[country2] || "Unknown League";
        //     // team2LeagueElement.textContent = league2;
        //     // Update Rank
        //     if (season === "All Seasons") {
        //         rank2 = "Rank: N/A (All Seasons)";
        //     } else {
        //         const var2 = data2.league_position;
        //         rank2 = "Rank: " + var2;
        //     }
        //     // Update Team Ratio
        //     const wins2 =  data2.wins ;
        //     const losses2 = data2.losses;
        //     const draws2 = data2.draws ;
        //     const ratio2 = wins2 + "/" + losses2 + "/" + draws2;
        //     team2Info.textContent = league2 + " | " + rank2 + " | "+ ratio2;
        // }

        // if (team1 && team2) {
        //     document.getElementById("team1-stats").style.display = "";
        //     document.getElementById("team2-stats").style.display = "";
        //     console.log("team2", data2);
        //     compareTeams(team1, team2, data1, data2, season);
        // }else {
        //     // Hide the stats element if no team is selected

        //     document.getElementById("team1-stats").style.display = "none";
        //     document.getElementById("team2-stats").style.display = "none";
        // }
    //     updateMatchesList();
    // }


    // function aggregateTeamData(teamDataArray) {
    //     const data1 = {};
    
    //     // Fields to sum
    //     const sumFields = [
    //         "wins", "losses", "draws",
    //         "wins_home", "draws_home", "losses_home",
    //         "wins_away", "draws_away", "losses_away",
    //         "matches_played_home", "matches_played_away",
    //         "goals_scored", "goals_conceded",
    //         "goals_scored_home", "goals_conceded_home",
    //         "goals_scored_away", "goals_conceded_away",
    //         "clean_sheets_home", "clean_sheets_away",
    //         "cards_total_home", "cards_total_away",
    //         "shots", "shots_home", "shots_away",
    //         "shots_on_target", "shots_on_target_home", "shots_on_target_away",
    //         "shots_off_target", "shots_off_target_home", "shots_off_target_away",
    //         "clean_sheets", "cards", "fouls", "corners_per_match"
    //     ];
    
    //     // Fields to average
    //     const avgFields = [
    //         "average_possession_home", "average_possession_away",
    //         "points_per_game_home", "points_per_game_away",
    //         "average_possession"
    //     ];
    
    //     // Sum fields
    //     sumFields.forEach(field => {
    //         data1[field] = teamDataArray.reduce((sum, teamData) => sum + (parseFloat(teamData[field]) || 0), 0);
    //     });
    
    //     // Average fields
    //     avgFields.forEach(field => {
    //         data1[field] = teamDataArray.reduce((sum, teamData) => sum + (parseFloat(teamData[field]) || 0), 0) / teamDataArray.length;
    //         data1[field] = parseFloat(data1[field].toFixed(1)); // Round to 1 decimal place
    //     });
    
    //     // Aggregate time period goals
    //     const timePeriods = ['0_to_10', '11_to_20', '21_to_30', '31_to_40', '41_to_50', '51_to_60', '61_to_70', '71_to_80', '81_to_90'];
    //     timePeriods.forEach(period => {
    //         data1[`goals_scored_min_${period}`] = teamDataArray.reduce((sum, teamData) => sum + (parseInt(teamData[`goals_scored_min_${period}`]) || 0), 0);
    //         data1[`goals_conceded_min_${period}`] = teamDataArray.reduce((sum, teamData) => sum + (parseInt(teamData[`goals_conceded_min_${period}`]) || 0), 0);
    //     });
    
    //     // Handle non-numeric fields
    //     data1.common_name = teamDataArray[0].common_name;
    //     data1.country = teamDataArray[0].country;
    //     data1.league_position = "-"; // Not applicable for all seasons
    
    //     return data1;
    // }
    

    function compareTeams(team1, team2, data1, data2, season) {
        // Fetch and compare stats for team1 and team2
        const team1Stats = getTeamStats(team1, data1);
        const team2Stats = getTeamStats(team2, data2);

        const comparisonMetrics = [
            "Wins", 
            "Losses", 
            "Draws", 
            "Goals Scored", 
            "Goals Conceded", 
            "Clean Sheets", 
            "Average Possession",
            "Shots on Target",
            "Shots off Target",
            "Cards",
            "Fouls Committed",
            "Corners per match",
        ];

        let comparisonHtml1 = "<table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>";
        let comparisonHtml2 = "<table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>";

        comparisonMetrics.forEach(metric => {
            const team1Value = team1Stats[metric] || 0;
            const team2Value = team2Stats[metric] || 0;
            const isTeam1Better = team1Value > team2Value;
            const isTeam2Better = team2Value > team1Value;

            comparisonHtml1 += `<tr class="${isTeam1Better ? 'highlight-team1' : ''}"><td>${metric}</td><td>${team1Value}</td></tr>`;
            comparisonHtml2 += `<tr class="${isTeam2Better ? 'highlight-team2' : ''}"><td>${metric}</td><td>${team2Value}</td></tr>`;
        });

        comparisonHtml1 += "</tbody></table>";
        comparisonHtml2 += "</tbody></table>";

        document.getElementById("team1-stats").innerHTML = `<h2>${team1} Stats (${season})</h2>` + comparisonHtml1;
        document.getElementById("team2-stats").innerHTML = `<h2>${team2} Stats (${season})</h2>` + comparisonHtml2;
    }

    function getTeamStats(team, data) {
        console.log("team", data);
        // Fetch team stats based on the team name and season
        // This is a placeholder function, replace with actual data fetching logic
        return {
            Wins: data.wins,
            Losses: data.losses,
            Draws: data.draws,
            "Goals Scored": data.goals_scored,
            "Goals Conceded": data.goals_conceded,
            "Clean Sheets": data.clean_sheets,
            "Average Possession": data.average_possession,
            "Shots on Target": data.shots_on_target,
            "Shots off Target": data.shots_off_target,
            "Cards": data.cards_total,
            "Fouls Committed": data.fouls,
            "Corners per match": Math.round((data.corners_per_match) * 100) / 100,
        };
    }
});

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

function search(event, input) {
    if (event.key != "Enter" && event.type != "click") return
    let search = input.value.toLowerCase()
    
    let possible_cities = ctx.data["clubs_cities"].filter(d => d.City.toLowerCase() == search)
    let possible_clubs = ctx.data["clubs_cities"].filter(d => d.Club.toLowerCase() == search)

    if (possible_cities.length > 0) {
        city_name = city_name_to_id(possible_cities[0].City)
        city_event({type: "click"}, city_name)

        input.classList.add("found")
        setTimeout(() => input.classList.remove("found"), 500)

        if (d3.select(`#cities path[name='${possible_cities[0].City.toLowerCase()}']`).empty()) {
            let node = d3.select(`.extra-cities .${city_name}`).node()
            if (node == null) return
            node.classList.add("found")
            setTimeout(() => node.classList.remove("found"), 2000)
            return
        }
        d3.select(`#cities path[name='${possible_cities[0].City.toLowerCase()}']`)
            .transition()
            .duration(500)
            .attr("stroke", "darkgreen")
            .attr("stroke-width", 15)
            .transition()
            .duration(500)
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .transition()
            .duration(500)
            .attr("stroke", "darkgreen")
            .attr("stroke-width", 15)
            .transition()
            .duration(500)
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)

        return
    }
    if (possible_clubs.length > 0) {
        console.log("Club:", possible_clubs[0].Club)
        return
    }

}

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
    updateStatItem(statsGrid, 'Shots', match.home_team_shots, match.away_team_shots);
    updateStatItem(statsGrid, 'Shots on Target', match.home_team_shots_on_target, match.away_team_shots_on_target);
    updateStatItem(statsGrid, 'Corners', match.home_team_corner_count, match.away_team_corner_count);
    updateStatItem(statsGrid, 'Fouls', match.home_team_fouls, match.away_team_fouls);

    //  cards
    updateCards('home-cards', match.home_team_yellow_cards, match.home_team_red_cards);
    updateCards('away-cards', match.away_team_yellow_cards, match.away_team_red_cards);

    //  match info
    matchDetails.querySelector('.referee span').textContent = match.referee;
    matchDetails.querySelector('.attendance span').textContent = Math.round(match.attendance);
    gameweek = match["Game Week"] ? match["Game Week"] : "N/A";
    matchDetails.querySelector('.gameweek span').textContent = gameweek;

    //  half-time score
    matchDetails.querySelector('.home-ht').textContent = match.home_team_goal_count_half_time;
    matchDetails.querySelector('.away-ht').textContent = match.away_team_goal_count_half_time;

    // Update possession
    matchDetails.querySelector('.home-possession').textContent = `${match.home_team_possession}%`;
    matchDetails.querySelector('.away-possession').textContent = `${match.away_team_possession}%`;
    matchDetails.querySelector('.possession-bar').style.setProperty('--home-possession', `${match.home_team_possession}%`);

    // Update stats
    updateStatItem(statsGrid, 'shots', 
        match.home_team_shots, match.away_team_shots,
        match.home_team_shots_on_target, match.away_team_shots_on_target,
        match.home_team_shots_off_target, match.away_team_shots_off_target
    );
    updateStatItem(statsGrid, 'corners', 
        match.home_team_corner_count, match.away_team_corner_count
    );
    updateStatItem(statsGrid, 'fouls',
        match.home_team_fouls, match.away_team_fouls
    );

    // Update cards
    updateCards('home-cards-first', match.home_team_first_half_cards, 'yellow');
    updateCards('home-cards-second', match.home_team_second_half_cards, 'yellow');
    updateCards('away-cards-first', match.away_team_first_half_cards, 'yellow');
    updateCards('away-cards-second', match.away_team_second_half_cards, 'yellow');

    // Add red cards if any
    if (match.home_team_red_cards > 0) updateCards('home-cards-second', match.home_team_red_cards, 'red');
    if (match.away_team_red_cards > 0) updateCards('away-cards-second', match.away_team_red_cards, 'red');

    // Clear and update goal timings
    document.querySelector('.home-goals').innerHTML = '';
    document.querySelector('.away-goals').innerHTML = '';
    updateGoalTimings('home-goals', match.home_team_goal_timings);
    updateGoalTimings('away-goals', match.away_team_goal_timings);
}

function updateStatItem(grid, type, homeValue, awayValue) {
    const item = grid.querySelector(`[data-stat="${type}"]`);
    if (item) {
        item.querySelector('.home-value').textContent = homeValue;
        item.querySelector('.away-value').textContent = awayValue;
    }
}

function updateCards(containerClass, count, type) {
    const container = document.querySelector(`.${containerClass}`);
    for (let i = 0; i < count; i++) {
        const card = document.createElement('div');
        card.className = `card ${type}`;
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



