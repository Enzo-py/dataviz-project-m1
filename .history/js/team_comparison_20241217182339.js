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
    const team1 = document.getElementById("team1").value;
    const team2 = document.getElementById("team2").value;
    const season = document.getElementById("season").value;
    const matchesListElement = document.getElementById("matches-list");
    const matchesTable = document.querySelector(".matches"); // Reference to the matches section

    if (!team1 || !team2) {
        matchesListElement.innerHTML = `
            <tr>
                <td colspan="5">Please select both teams.</td>
            </tr>`;
        matchesTable.style.display = 'none'; // Hide matches table
        return;
    }

    // Retrieve league information
    const league1 = getTeamLeague(team1, season);
    const league2 = getTeamLeague(team2, season);

    if (league1 !== league2) {
        matchesListElement.innerHTML = `
            <tr>
                <td colspan="5">The teams are not in the same league.</td>
            </tr>`;
        matchesTable.style.display = 'none'; // Hide matches table
        return;
    } else {
        matchesTable.style.display = ''; // Show matches table
    }

    let allMatches = [];
    if(team1 && team2){
        console.log("team1", team1);    
        console.log("team2", team2);
        if (season === "All Seasons") {
            // Combine matches from all seasons in reverse order
            ["2023-2024", "2022-2023", "2021-2022"].forEach(s => {
                if (ctx.matches[s]) {
                    allMatches = allMatches.concat(
                        ctx.matches[s].filter(match =>
                            (match.home_team_name === team1 && match.away_team_name === team2) || 
                            (match.home_team_name === team2 && match.away_team_name === team1)
                        )
                    );
                }
            });

        } else if (ctx.matches[season]) {
            allMatches = ctx.matches[season].filter(match =>
                (match.home_team_name === team1 && match.away_team_name === team2) || 
                (match.home_team_name === team2 && match.away_team_name === team1)
            );
        }
        console.log(matchesListElement);
    }else if(team1 === team2){
        matchesListElement.innerHTML = `
        <tr>
            <td colspan="5">Choose two different teams.</td>
        </tr>`;
    }else{
        matchesListElement.innerHTML = `
        <tr>
            <td colspan="5">Choose a team to compare to.</td>
        </tr>`;
    }


    // Sort matches by date in descending order (newest first)
    allMatches.sort((a, b) => new Date(b.date_GMT) - new Date(a.date_GMT));
    matchesListElement.innerHTML = "";

    if (allMatches.length > 0) {
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
            matchesListElement.appendChild(row);
        });
    } else {
        matchesListElement.innerHTML = `
            <tr>
                <td colspan="5">No matches found for ${team1} ${season === "All Seasons" ? "in any season" : `in ${season}`}.</td>
            </tr>`;
    }
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
        if (team1Param) {
            const team1Input = document.getElementById("team1");
            team1Input.value = team1Param;
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
        let data1;
        let data2;
        let league1;
        let league2;

        if (team1) {
            
            document.getElementById("team1-stats").innerHTML = `<h2>${team1} Stats (${season})</h2><p>Stats for ${team1} in ${season} will be displayed here.</p>`;
            const team1Logo = document.getElementById("team1-logo");
            const team1Info = document.getElementById("team1-info");
            const logoURL1 = ctx.logos[team1];

            if (season === "All Seasons") {
                // Aggregate statistics from all seasons
                const seasons = ["2021-2022", "2022-2023", "2023-2024"];
                const teamDataArray = seasons
                    .map(s => ctx.teams[s]?.find(team => team.common_name === team1))
                    .filter(Boolean);
                

                // Initialize aggregated data
                data1 = aggregateTeamData(teamDataArray);
            } else if (ctx.teams[season]) {
                data1 = ctx.teams[season].find(team => team.common_name === team1);
            }
            if (logoURL1) {
                team1Logo.src = logoURL1;
                team1Logo.alt = `${team1} Logo`;
            } else {
                team1Logo.src = "";
                team1Logo.alt = "Logo not available";
            }

            // Update League
            const country1 = data1 && data1.length > 0 ? data1.country.toLowerCase() : data1 ? data1.country.toLowerCase() : "";
            league1 = countryToLeague[country1] || "Unknown League";
           
            // Update Rank
            if (season === "All Seasons") {
                rank1 = "Rank: N/A (All Seasons)";
            } else {
                const var1 = data1.league_position;
                rank1 = "Rank: " + var1;
            }
            // Update Team Ratio
            const wins =  data1.wins ;
            const losses = data1.losses;
            const draws = data1.draws ;
            const ratio = wins + "/" + losses + "/" + draws;
            team1Info.textContent = league1 + " | " + rank1 + " | "+ ratio;
                        
        }

        if (team2) {
            console.log("team2", data2);
            document.getElementById("team2-stats").innerHTML = `<h2>${team2} Stats (${season})</h2><p>Stats for ${team2} in ${season} will be displayed here.</p>`;
            const team2Logo = document.getElementById("team2-logo");
            const team2Info = document.getElementById("team2-info");
            const logoURL2 = ctx.logos[team2];

            if (season === "All Seasons") {
                // Aggregate statistics from all seasons
                const seasons = ["2021-2022", "2022-2023", "2023-2024"];
                const teamDataArray = seasons
                    .map(s => ctx.teams[s]?.find(team => team.common_name === team2))
                    .filter(Boolean);
                

                // Initialize aggregated data
                data2 = aggregateTeamData(teamDataArray);

            } else if (ctx.teams[season]) {
                data2 = ctx.teams[season].find(team => team.common_name === team2);
            }

            if (logoURL2) {
                team2Logo.src = logoURL2;
                team2Logo.alt = `${team2} Logo`;
            } else {
                team2Logo.src = "";
                team2Logo.alt = "Logo not available";
            }
            // Update League
            const country2 = data2 && data2.length > 0 ? data2.country.toLowerCase() : data2 ? data2.country.toLowerCase() : "";
            league2 = countryToLeague[country2] || "Unknown League";
            // team2LeagueElement.textContent = league2;
            // Update Rank
            if (season === "All Seasons") {
                rank2 = "Rank: N/A (All Seasons)";
            } else {
                const var2 = data2.league_position;
                rank2 = "Rank: " + var2;
            }
            // Update Team Ratio
            const wins2 =  data2.wins ;
            const losses2 = data2.losses;
            const draws2 = data2.draws ;
            const ratio2 = wins2 + "/" + losses2 + "/" + draws2;
            team2Info.textContent = league2 + " | " + rank2 + " | "+ ratio2;
        }

        if (team1 && team2) {
            console.log("team2", data2);
            compareTeams(team1, team2, data1, data2, season);
        } else {
            document.getElementById("team2-stats").innerHTML = `<p>Please select a team.</p>`;
        }
        console.log("league1", league1);
        console.log("league2", league2);
        updateMatchesList();
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

    function compareTeams(team1, team2, data1, data2, season) {
        // Fetch and compare stats for team1 and team2
        const team1Stats = getTeamStats(team1, data1);
        const team2Stats = getTeamStats(team2, data2);

        const comparisonMetrics = [
            "wins", "losses", "draws", "goals_scored", "goals_conceded", "clean_sheets", "average_possession"
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
            wins: data.wins,
            losses: data.losses,
            draws: data.draws,
            goals_scored: data.goals_scored,
            goals_conceded: data.goals_conceded,
            clean_sheets: data.clean_sheets,
            average_possession: data.average_possession
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

}



