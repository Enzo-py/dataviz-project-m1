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
            let data1
            if (season === "All Seasons") {
                // Aggregate statistics from all seasons
                const seasons = ["2021-2022", "2022-2023", "2023-2024"];
                const team1DataArray = seasons
                    .map(s => ctx.teams[s]?.find(team => team.common_name === team1))
                    .filter(Boolean);

                if (team1DataArray.length === 0) {
                    team1LeagueElement.textContent = "Second Division";
                    team1rankElement.textContent = "N/A";
                    team1RatioElement.textContent = "- - -";
                    return;
                }

                // Initialize aggregated data
                data1 = aggregateTeamData(team1DataArray);

            } else if (ctx.teams[season]) {
                data1 = ctx.teams[season].find(team => team.common_name === team1);
            }

            document.getElementById("team1-stats").innerHTML = `<h2>${team1} Stats (${season})</h2><p>Stats for ${team1} in ${season} will be displayed here.</p>`;
            const team1Logo = document.getElementById("team-logo");
            const team1NameElement = document.getElementById("team-name");
            const team1LeagueElement = document.getElementById("team-league");
            const logoURL1 = ctx.logos[team1];
            const team1RankElement= document.getElementById("team-rank");
            const team1RatioElement = document.getElementById("team-ratio");

            if (logoURL1) {
                teamLogo1.src = logoURL;
                teamLogo1.alt = `${team1} Logo`;
            } else {
                teamLogo1.src = "";
                teamLogo1.alt = "Logo not available";
            }
            team1NameElement.textContent = team1;

            // Update League
            const country1 = data1 && data1.length > 0 ? data1.country.toLowerCase() : data1 ? data1.country.toLowerCase() : "";
            const league1 = countryToLeague[country1] || "Unknown League";
            team1LeagueElement.textContent = league1;
            // Update Rank
            if (season === "All Seasons") {
                team1RankElement.textContent = "Rank: N/A (All Seasons)";
            } else {
                const rank1 = data1.league_position;
                team1RankElement.textContent = "Rank: " + rank1;
            }
            // Update Team Ratio
            const wins =  data1.wins ;
            const losses = data1.losses;
            const draws = data1.draws ;
            const ratio = wins + "/" + losses + "/" + draws;
            team1RatioElement.textContent = ratio
                        
        }

        if (team2) {
            let data2
            if (season === "All Seasons") {
                // Aggregate statistics from all seasons
                const seasons = ["2021-2022", "2022-2023", "2023-2024"];
                const team2DataArray = seasons
                    .map(s => ctx.teams[s]?.find(team => team.common_name === team2))
                    .filter(Boolean);

                if (team2DataArray.length === 0) {
                    team2LeagueElement.textContent = "Second Division";
                    team2RankElement.textContent = "N/A";
                    team2RatioElement.textContent = "- - -";
                    return;
                }

                // Initialize aggregated data
                data2 = aggregateTeamData(teamDataArray);

            } else if (ctx.teams[season]) {
                data2 = ctx.teams[season].find(team => team.common_name === team2);
            }
            document.getElementById("team2-stats").innerHTML = `<h2>${team2} Stats (${season})</h2><p>Stats for ${team2} in ${season} will be displayed here.</p>`;
            const team2Logo = document.getElementById("team-logo");
            const team2NameElement = document.getElementById("team-name");
            const team2LeagueElement = document.getElementById("team-league");
            const logoURL2 = ctx.logos[team1];
            const team2RankElement= document.getElementById("team-rank");
            const team2RatioElement = document.getElementById("team-ratio");

            if (logoURL2) {
                teamLogo2.src = logoURL;
                teamLogo2.alt = `${team2} Logo`;
            } else {
                teamLogo2.src = "";
                teamLogo2.alt = "Logo not available";
            }
            team2NameElement.textContent = team2;
            // Update League
            const country2 = data2 && data2.length > 0 ? data2.country.toLowerCase() : data2 ? data2.country.toLowerCase() : "";
            const league2 = countryToLeague[country2] || "Unknown League";
            team2LeagueElement.textContent = league2;
            // Update Rank
            if (season === "All Seasons") {
                team2RankElement.textContent = "Rank: N/A (All Seasons)";
            } else {
                const rank2 = data2.league_position;
                team2RankElement.textContent = "Rank: " + rank2;
            }
            // Update Team Ratio
            const wins2 =  data2.wins ;
            const losses2 = data2.losses;
            const draws2 = data2.draws ;
            const ratio2 = wins2 + "/" + losses2 + "/" + draws2;
            team2RatioElement.textContent = ratio2
        }

        if (team1 && team2) {
            compareTeams(team1, team2, season);
        }
    }


    function aggregateTeamData(teamDataArray) {
        const data1 = {};

        // Fields to sum
        const sumFields = [
            "wins", "losses", "draws",
            "wins_home", "draws_home", "losses_home",
            "wins_away", "draws_away", "losses_away",
            "matches_played_home", "matches_played_away",
            "goals_scored", "goals_conceded",
            "goals_scored_home", "goals_conceded_home",
            "goals_scored_away", "goals_conceded_away",
            "clean_sheets_home", "clean_sheets_away",
            "cards_total_home", "cards_total_away",
            "shots", "shots_home", "shots_away",
            "shots_on_target", "shots_on_target_home", "shots_on_target_away",
            "shots_off_target", "shots_off_target_home", "shots_off_target_away"
        ];

        // Fields to average
        const avgFields = [
            "average_possession_home", "average_possession_away",
            "points_per_game_home", "points_per_game_away"
        ];

        // Sum fields
        sumFields.forEach(field => {
            data1[field] = teamDataArray.reduce((sum, teamData) => sum + (parseFloat(teamData[field]) || 0), 0);
        });

        // Average fields
        avgFields.forEach(field => {
            data1[field] = teamDataArray.reduce((sum, teamData) => sum + (parseFloat(teamData[field]) || 0), 0) / teamDataArray.length;
        });

        // Aggregate time period goals
        const timePeriods = ['0_to_10', '11_to_20', '21_to_30', '31_to_40', '41_to_50', '51_to_60', '61_to_70', '71_to_80', '81_to_90'];
        timePeriods.forEach(period => {
            data1[`goals_scored_min_${period}`] = teamDataArray.reduce((sum, teamData) => sum + (parseInt(teamData[`goals_scored_min_${period}`]) || 0), 0);
            data1[`goals_conceded_min_${period}`] = teamDataArray.reduce((sum, teamData) => sum + (parseInt(teamData[`goals_conceded_min_${period}`]) || 0), 0);
        });

        // Handle non-numeric fields
        data1.common_name = teamDataArray[0].common_name;
        data1.country = teamDataArray[0].country;
        data1.league_position = "-"; // Not applicable for all seasons

        return data1;
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

    // animation input not found
    input.classList.add("not-found")
    setTimeout(() => input.classList.remove("not-found"), 500)
}
