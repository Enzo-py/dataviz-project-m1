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
        allMatches.forEach((match, i) => {
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
            `;            row.style.cursor = "pointer";
            row.addEventListener("click", () => {
                const currentTeam = document.getElementById("team1").value;
                window.location.href = `matches.html?match=${match.match_id}&team=${currentTeam}`;
            });
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
    const urlParams = new URLSearchParams(window.location.search);
    const teamParam = urlParams.get('club');

    // create url to the player page
    const player_page = "player.html?club=" + teamParam;
    const compare_page = "team_comparison.html?club=" + teamParam;
    // Update both links
    // d3.selectAll("a.view-players, a.view-team-players").attr("href", player_page);
    
    d3.selectAll("a.compare-teams").attr("href", compare_page);
    d3.selectAll("a.view-team-players").attr("href", player_page);

    document.getElementById("team1").addEventListener("change", updateStats);
    document.getElementById("season").addEventListener("change", function() {
        updateTeamsList();
        updateStats();
        updateMatchesList();
        
    });

    let showingLeagueAverage = false; // Add state variable

    document.querySelectorAll("#toggle-league-average").forEach(button => {
        button.addEventListener("click", function() {
            showingLeagueAverage = !showingLeagueAverage; // Toggle state
            button.textContent = showingLeagueAverage ? "Show Club Stats" : "Show League Average";
            
            const team1 = document.getElementById("team1").value;
            const season = document.getElementById("season").value;
            let teamData;

            if (season === "All Seasons") {
                const seasons = ["2021-2022", "2022-2023", "2023-2024"];
                const teamDataArray = seasons
                    .map(s => ctx.teams[s]?.find(team => team.common_name === team1))
                    .filter(Boolean);

                if (teamDataArray.length > 0) {
                    teamData = aggregateTeamData(teamDataArray);
                }
            } else {
                teamData = ctx.teams[season]?.find(team => team.common_name === team1);
            }

            if (showingLeagueAverage) {
                updateCharts(calculateLeagueAverage());
            } else if (teamData) {
                updateCharts(teamData);
            } else {
                console.error("Team data not found for the selected team and season.");
            }
        });
    });

    // Show the loading screen
    team_info = d3.select(".team-info").style("transform", "scale(0)")
    matches_info = d3.select(".matches").style("transform", `translateX(-${parseInt(window.innerWidth * 0.45)}px)`)
    pages = d3.selectAll(".page").style("transform", "scale(0)")
    pages_hear = d3.select(".head-pages").style("transform", "translateY(-200px)")
    menu_wrapper = d3.select("menu").style("display", "none").style("transform", "translateX(300px)")

    document.getElementById("loading-screen").style.display = "flex";
    load_data().then(() => {
        if (teamParam) {
            const teamInput = document.getElementById("team1");
            teamInput.value = teamParam;
        }
        updateTeamsList();
        updateStats();
        updateMatchesList();

        page1_anim(true)
        page2_anim(true, true)

        // Hide the loading screen
        document.getElementById("loading-screen").style.display = "none";
        d3.select("body").attr("ready", true);
        team_info.transition()
            .duration(450)
            .style("transform", "scale(1.1)")
            .transition()
            .duration(200)
            .style("transform")

        pages.transition()
            .duration(650)
            .delay(150)
            .style("transform", "scale(1.02)")
            .transition()
            .duration(300)
            .style("transform")

        matches_info.transition()
            .duration(1000)
            .delay(400)
            .style("transform", "translateX(8px)")
            .transition()
            .duration(250)
            .style("transform")

        pages_hear.transition()
            .duration(500)
            .delay(1000)
            .style("transform", "translateY(8px)")
            .transition()
            .duration(250)
            .style("transform")

        menu_wrapper.transition()
            .duration(500)
            .delay(1200)
            .style("display")
            .style("transform", "translateX(-16px)")
            .transition()
            .duration(250)
            .style("transform")

        setTimeout(() => {
            page1_anim()
        }, 1500)

    });

    function updateStats() {
        updateTeamsList();
        updateMatchesList();
        const team1 = document.getElementById("team1").value;
        const season = document.getElementById("season").value;

        // update player page link
        const player_page = "player.html?club=" + team1
        const compare_page = "team_comparison.html?club=" + teamParam;
        player_a = d3.select("a.view-players")
        player_b = d3.select("a.compare-teams")
        console.log(player_b)
        // player_a.attr("href", player_page)
        player_b.attr("href", compare_page)
        window.redirectToPlayers = function () {
            if (teamParam) {
                window.location.href = player_page;
            } else {
                alert("No team parameter provided in the URL!");
            }
        };

        if (team1) {
            let data1;
            // console.log(season)
            
            // Create Variables
            const teamLogo = document.getElementById("team-logo");
            const teamNameElement = document.getElementById("team-name");
            const teamLeagueElement = document.getElementById("team-league");
            const logoURL = ctx.logos[team1];
            const teamRankElement= document.getElementById("team-rank");
            const teamRatioElement = document.getElementById("team-ratio");

            if (season === "All Seasons") {
                // Aggregate statistics from all seasons
                const seasons = ["2021-2022", "2022-2023", "2023-2024"];
                const teamDataArray = seasons
                    .map(s => ctx.teams[s]?.find(team => team.common_name === team1))
                    .filter(Boolean);

                if (teamDataArray.length === 0) {
                    teamLeagueElement.textContent = "Second Division";
                    teamRankElement.textContent = "N/A";
                    teamRatioElement.textContent = "- - -";
                    return;
                }

                // Initialize aggregated data
                data1 = aggregateTeamData(teamDataArray);

            } else if (ctx.teams[season]) {
                data1 = ctx.teams[season].find(team => team.common_name === team1);
            }

            if (!data1) {
                teamLeagueElement.textContent = "Second Division";
                teamRankElement.textContent = "N/A";
                teamRatioElement.textContent = "- - -";
                return;
            }
            // Update player view link
            
            // Update info            
            if (logoURL) {
                teamLogo.src = logoURL;
                teamLogo.alt = `${team1} Logo`;
            } else {
                teamLogo.src = "";
                teamLogo.alt = "Logo not available";
            }
            teamNameElement.textContent = team1;

            // Update League
            const country = data1 && data1.length > 0 ? data1.country.toLowerCase() : data1 ? data1.country.toLowerCase() : "";
            const league = countryToLeague[country] || "Unknown League";
            teamLeagueElement.textContent = league;
            // Update Rank
            if (season === "All Seasons") {
                teamRankElement.textContent = "Rank: N/A (All Seasons)";
            } else {
                const rank = data1.league_position;
                teamRankElement.textContent = "Rank: " + rank;
            }
            // Update Team Ratio
            const wins =  data1.wins ;
            const losses = data1.losses;
            const draws = data1.draws ;
            const ratio = wins + "/" + losses + "/" + draws;
            teamRatioElement.textContent = ratio
            
            console.log("Creating charts for team:", team1);
            updateCharts(showingLeagueAverage ? calculateLeagueAverage() : data1);
            console.log("Charts creation completed");
       
        } else {
            document.getElementById("team1-stats").innerHTML = `<p>Please select a team.</p>`;
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

function createPerformanceChart(data) {
    if (!data) {
        console.error("No data provided for performance chart");
        return;
    }

    console.log("Creating chart with data:", data);

    // Clear existing chart
    d3.select("#performance-chart").html("");

    // Define metrics to compare, using exact column names from the CSV
    const metrics = [
        { label: "Matches Played", home: "matches_played_home", away: "matches_played_away" },
        { label: "Wins", home: "wins_home", away: "wins_away" },
        { label: "Draws", home: "draws_home", away: "draws_away" },
        { label: "Losses", home: "losses_home", away: "losses_away" },
        { label: "Points per Game", home: "points_per_game_home", away: "points_per_game_away" },
        { label: "Goals scored", home: "goals_scored_home", away: "goals_scored_away" },
        { label: "Goals Conceded", home: "goals_conceded_home", away: "goals_conceded_away" },
        { label: "Clean Sheets", home: "clean_sheets_home", away: "clean_sheets_away" },
        { label: "Yellow/Red Cards", home: "cards_total_home", away: "cards_total_away" },
        { label: "Possession %", home: "average_possession_home", away: "average_possession_away" }
    ];

    console.log(metrics);

    // Process the metrics data
    const processedMetrics = metrics.map(metric => ({
        ...metric,
        homeValue: parseFloat(data[metric.home]) || 0,
        awayValue: parseFloat(data[metric.away]) || 0
    }));

    const margin = { top: 30, right: 60, bottom: 30, left: 160 };
    const width = 800 - margin.left - margin.right;
    const height = metrics.length * 50;

    const svg = d3.select("#performance-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const maxValue = d3.max(processedMetrics, d =>
        Math.max(Math.abs(d.homeValue) + 5, Math.abs(d.awayValue) + 5)
    );

    const x = d3.scaleLinear()
        .domain([-maxValue, maxValue])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(metrics.map(d => d.label))
        .range([0, height])
        .padding(0.1);

    svg.append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "#666")
        .style("stroke-dasharray", "4,4");

    // Add bars and labels
    processedMetrics.forEach(metric => {
        // Home bar
        svg.append("rect")
            .attr("class", "bar-home")
            .attr("x", x(0) - (x(metric.homeValue) - x(0)))
            .attr("y", y(metric.label))
            .attr("width", x(metric.homeValue) - x(0))
            .attr("height", y.bandwidth())
            .attr("opacity", 0.7);

        // Away bar
        svg.append("rect")
            .attr("class", "bar-away")
            .attr("x", x(0))
            .attr("y", y(metric.label))
            .attr("width", x(metric.awayValue) - x(0))
            .attr("height", y.bandwidth())
            .attr("opacity", 0.7);

        // Labels
        svg.append("text")
            .attr("class", "bar-label")
            .attr("x", x(0) - (x(metric.homeValue) - x(0)) - 8)
            .attr("y", y(metric.label) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .style("font-size", "16px")
            .style("fill", "var(--text-light-color)")
            .text(Math.round(metric.homeValue));

        svg.append("text")
            .attr("class", "bar-label")
            .attr("x", x(metric.awayValue) + 8)
            .attr("y", y(metric.label) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .style("font-size", "16px")
            .style("fill", "var(--text-light-color)")
            .text(Math.round(metric.awayValue));
    });

    //  labels
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${-30},0)`)
        .call(d3.axisLeft(y).tickSize(0))
        .call(g => {
            g.select(".domain").remove();
            g.selectAll(".tick text")
                .style("font-size", "0.9rem")
                .style("font-weight", "normal")
                .style("fill", "var(--text-white-color)")

        });

    //  legend
    const legend = svg.append("g")
        .attr("transform", `translate(-20,${height + 10})`);

    legend.append("rect")
        .attr("class", "bar-home")
        .attr("x", x(0) - 50)
        .attr("width", 20)
        .attr("height", 10)
        .attr("opacity", 0.7);

    legend.append("rect")
        .attr("class", "bar-away")
        .attr("x", x(0) + 30)
        .attr("width", 20)
        .attr("height", 10)
        .attr("opacity", 0.7);

    legend.append("text")
        .attr("x", x(0) - 25)
        .attr("y", 9)
        .attr("text-anchor", "start")
        .text("Home");

    legend.append("text")
        .attr("x", x(0) + 55)
        .attr("y", 9)
        .attr("text-anchor", "start")
        .text("Away");

    legend.selectAll("text")
        .style("font-size", "14px")
        .style("font-weight", "normal")
        .style("fill", "var(--text-white-color)");
}

function createGoalsTimelineChart(data) {
    if (!data) {
        console.log("No data provided for timeline chart");
        return;
    }
    
    console.log("Creating timeline chart with data:", data);
    
    // Clear existing chart
    const chartContainer = d3.select("#goals-timeline-chart");
    if (chartContainer.empty()) {
        console.log("Chart container not found");
        return;
    }
    chartContainer.html("");

    // Define time periods and get corresponding values
    const timePeriods = ['0-10', '11-20', '21-30', '31-40', '41-50', '51-60', '61-70', '71-80', '81-90'];
    
    const scoredData = timePeriods.map((period, i) => ({
        period: period,
        value: parseInt(data[`goals_scored_min_${period.replace('-', '_to_')}`]) || 0
    }));

    const concededData = timePeriods.map((period, i) => ({
        period: period,
        value: parseInt(data[`goals_conceded_min_${period.replace('-', '_to_')}`]) || 0
    }));

    // Set up dimensions
    const margin = { top: 20, right: 60, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select("#goals-timeline-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3.scaleBand()
        .domain(timePeriods)
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, Math.max(
            d3.max(scoredData, d => d.value),
            d3.max(concededData, d => d.value)
        ) + 1])
        .range([height, 0]);

    // Create lines
    const scoredLine = d3.line()
        .x(d => x(d.period) + x.bandwidth() / 2)
        .y(d => y(d.value));

    const concededLine = d3.line()
        .x(d => x(d.period) + x.bandwidth() / 2)
        .y(d => y(d.value));

    // Add the lines
    svg.append("path")
        .datum(scoredData)
        .attr("class", "line-scored")
        .attr("fill", "none")
        .attr("stroke", "#28a745")
        .attr("stroke-width", 2)
        .attr("d", scoredLine);

    svg.append("path")
        .datum(concededData)
        .attr("class", "line-conceded")
        .attr("fill", "none")
        .attr("stroke", "#dc3545")
        .attr("stroke-width", 2)
        .attr("d", concededLine);

    // Add dots
    svg.selectAll(".dot-scored")
        .data(scoredData)
        .enter()
        .append("circle")
        .attr("class", "dot-scored")
        .attr("cx", d => x(d.period) + x.bandwidth() / 2)
        .attr("cy", d => y(d.value))
        .attr("r", 4)
        .attr("fill", "#28a745");

    svg.selectAll(".dot-conceded")
        .data(concededData)
        .enter()
        .append("circle")
        .attr("class", "dot-conceded")
        .attr("cx", d => x(d.period) + x.bandwidth() / 2)
        .attr("cy", d => y(d.value))
        .attr("r", 4)
        .attr("fill", "#dc3545");

    // Add value labels
    svg.selectAll(".label-scored")
        .data(scoredData)
        .enter()
        .append("text")
        .attr("class", "label-scored")
        .attr("x", d => x(d.period) + x.bandwidth() / 2)
        .attr("y", d => y(d.value) - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "#28a745")
        .text(d => d.value);

    svg.selectAll(".label-conceded")
        .data(concededData)
        .enter()
        .append("text")
        .attr("class", "label-conceded")
        .attr("x", d => x(d.period) + x.bandwidth() / 2)
        .attr("y", d => y(d.value) + 20)
        .attr("text-anchor", "middle")
        .attr("fill", "#dc3545")
        .text(d => d.value);

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .style("color", "var(--text-light-color)")
        .selectAll("text")
        .style("font-size", "12px")
        .style("color", "var(--text-light-color)")

    // Add X axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + 35)
        .style("font-size", "12px")
        .style("fill", "var(--text-white-color)")
        .text("Minutes");

    svg.append("g")
        .call(d3.axisLeft(y))
        .style("color", "var(--text-light-color)")
        .selectAll("text")
        .style("fill", "var(--text-light-color)")
        .style("font-size", "12px");

    // Add Y axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2 + 10)
        .style("font-size", "12px")
        .style("fill", "var(--text-white-color)")
        .style("font-weight", "normal")
        .text("Goals");

    // Move legend to bottom center
    const legend = svg.append("g")
        .attr("transform", `translate(${width/2 - 100},${height + 45})`);

    legend.append("circle")
        .attr("cx", -20)
        .attr("cy", 0)
        .attr("r", 4)
        .style("fill", "#28a745");

    legend.append("text")
        .attr("x", -10)
        .attr("y", 0)
        .attr("dy", "0.32em")
        .style("fill", "var(--text-white-color)")
        .style("font-weight", "normal")
        .text("Goals Scored")

    legend.append("circle")
        .attr("cx", 100)
        .attr("cy", 0)
        .attr("r", 4)
        .style("fill", "#dc3545");

    legend.append("text")
        .attr("x", 110)
        .attr("y", 0)        
        .attr("dy", "0.32em")        
        .style("fill", "var(--text-white-color)")
        .style("font-weight", "normal")
        .text("Goals Conceded")


}

function createGoalsDonutChart(data) {
    // Clear existing chart
    d3.select("#donut-charts").html("");

    const width = 300; 
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select("#donut-charts")
        .append("svg")
        .attr("width", width + 190)
        .attr("height", height + 50)
        .append("g")
        .attr("transform", `translate(${(width + 190) / 2},${(height + 50) / 2})`);

    const goalsData = [
        { label: "Goals Scored", value: parseInt(data.goals_scored) || 0, color: "#28a745" },
        { label: "Goals Conceded", value: parseInt(data.goals_conceded) || 0, color: "#dc3545" }
    ];

    const total = goalsData.reduce((sum, d) => sum + d.value, 0);

    // Create pie chart layout
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    // Create arc generator
    const arc = d3.arc()
        .innerRadius(radius * 0.6) // Create donut hole
        .outerRadius(radius);

    // Create arcs
    const arcs = svg.selectAll("arc")
        .data(pie(goalsData))
        .enter()
        .append("g");

    // Add paths
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => d.data.color)
        .attr("stroke", "var(--second-background-color)")
        .style("stroke-width", "2px")
        .style("opacity", 0.8);

    // Add labels
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "var(--second-background-color)")
        .text(d => d.data.value);

    // Add center text
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.5em")
        .style("font-size", "14px")
        .style("fill", "var(--text-white-color)")
        .text("Total Goals");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("fill", "var(--text-white-color)")
        .text(total);

    // Update legend position and styling
    const legend = svg.append("g")
        .attr("transform", `translate(${radius - 40},${radius - 40})`);  // Position at bottom right

    goalsData.forEach((d, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 25})`);  // Increased spacing between items

        legendRow.append("rect")
            .attr("width", 16)
            .attr("height", 16)
            .attr("rx", 2)  // Rounded corners
            .attr("fill", d.color)
            .style("opacity", 0.8);

        legendRow.append("text")
            .attr("x", 24)
            .attr("y", 8)
            .attr("dy", "0.32em")
            .style("font-size", "14px")
            .style("font-weight", "normal")
            .style("fill", "var(--text-white-color)")
            .text(d.label);
    });
}

function createWinsDonutChart(data) {
    // Clear existing chart
    // d3.select("#wins-donut-chart").html("");

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const margin = 180;

    const svg = d3.select("#donut-charts")
        .append("svg")
        .attr("width", width + 180)
        .attr("height", height + 50)
        .append("g")
        .attr("transform", `translate(${(width + 180) / 2},${(height + 50) / 2})`);

    const winsData = [
        { label: "Wins", value: parseInt(data.wins) || 0, color: "#28a745" },
        { label: "Draws", value: parseInt(data.draws) || 0, color: "#6c757d" },
        { label: "Losses", value: parseInt(data.losses) || 0, color: "#dc3545" }
    ];

    const total = winsData.reduce((sum, d) => sum + d.value, 0);

    // Create pie chart layout
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    // Create arc generator
    const arc = d3.arc()
        .innerRadius(radius * 0.6) // Create donut hole
        .outerRadius(radius);

    // Create arcs
    const arcs = svg.selectAll("arc")
        .data(pie(winsData))
        .enter()
        .append("g");

    // Add paths
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => d.data.color)
        .attr("stroke", "var(--second-background-color)")
        .style("stroke-width", "2px")
        .style("opacity", 0.8);

    // Add labels
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "var(--second-background-color)")
        .text(d => d.data.value);

    // Add center text
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.5em")
        .style("font-size", "14px")
        .style("fill", "var(--text-white-color)")
        .text("Total Matches");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("fill", "var(--text-white-color)")
        .text(total);

    const legend = svg.append("g")
        .attr("transform", `translate(${radius - 40},${radius - 40})`);  

    winsData.forEach((d, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 25})`);  

        legendRow.append("rect")
            .attr("width", 16)
            .attr("height", 16)
            .attr("rx", 2)  
            .attr("fill", d.color)
            .style("opacity", 0.8);

        legendRow.append("text")
            .attr("x", 24)
            .attr("y", 8)
            .attr("dy", "0.32em")
            .style("font-size", "14px")
            .style("font-weight", "normal")
            .style("fill", "var(--text-white-color)")
            .text(d.label);
    });
}

function createShotsDonutChart(data) {
    // Clear existing chart
    // d3.select("#donut-charts").html("");

    const width = 300; 
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const margin = 180;

    const svg = d3.select("#donut-charts")
        .append("svg")
        .attr("width", width + 185)
        .attr("height", height + 50)
        .append("g")
        .attr("transform", `translate(${(width + 185) / 2},${(height + 50) / 2})`);

    const shotsData = [
        { label: "Shots On Target", value: parseInt(data.shots_on_target) || 0, color: "#28a745" },
        { label: "Shots Off Target", value: parseInt(data.shots_off_target) || 0, color: "#dc3545" }
    ];

    const total = shotsData.reduce((sum, d) => sum + d.value, 0);

    // Create pie chart layout
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    // Create arc generator
    const arc = d3.arc()
        .innerRadius(radius * 0.6) // Create donut hole
        .outerRadius(radius);

    // Create arcs
    const arcs = svg.selectAll("arc")
        .data(pie(shotsData))
        .enter()
        .append("g");

    // Add paths
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => d.data.color)
        .attr("stroke", "var(--second-background-color)")
        .style("stroke-width", "2px")
        .style("opacity", 0.8);

    // Add labels
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "var(--second-background-color)")
        .text(d => d.data.value);

    // Add center text
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.5em")
        .style("font-size", "14px")
        .style("fill", "var(--text-white-color)")
        .text("Total Shots");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("fill", "var(--text-white-color)")
        .text(total);

    // Update legend position and styling
    const legend = svg.append("g")
        .attr("transform", `translate(${radius - 40},${radius - 40})`);  // Position at bottom right

    shotsData.forEach((d, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 25})`);  // Increased spacing between items

        legendRow.append("rect")
            .attr("width", 16)
            .attr("height", 16)
            .attr("rx", 2)  // Rounded corners
            .attr("fill", d.color)
            .style("opacity", 0.8);

        legendRow.append("text")
            .attr("x", 24)
            .attr("y", 8)
            .attr("dy", "0.32em")
            .style("font-size", "14px")
            .style("font-weight", "normal")
            .style("fill", "var(--text-white-color)")
            .text(d.label);
    });
}

function calculateLeagueAverage() {
    const seasons = ["2021-2022", "2022-2023", "2023-2024"];
    const leagueData = {};

    seasons.forEach(season => {
        if (ctx.teams[season]) {
            ctx.teams[season].forEach(team => {
                for (const key in team) {
                    if (!leagueData[key]) leagueData[key] = [];
                    leagueData[key].push(parseFloat(team[key]) || 0);
                }
            });
        }
    });

    const leagueAverage = {};
    for (const key in leagueData) {
        const values = leagueData[key];
        leagueAverage[key] = values.reduce((sum, value) => sum + value, 0) / values.length;
    }

    return leagueAverage;
}

function updateCharts(data) {
    createPerformanceChart(data);
    createGoalsTimelineChart(data);
    createGoalsDonutChart(data);
    createWinsDonutChart(data);
    createShotsDonutChart(data);
}

function page1_anim(setup_start) {
    donut_charts = d3.selectAll("#donut-charts svg")
    donut_charts.each(function(_, i) {
        chart = d3.select(this)
        console.log(chart.selectAll('path'))

        // chacher les text si setup_start
        chart.selectAll('text, rect').each(function(_, j) {
            text = d3.select(this)
            if (setup_start) {
                text.style("opacity", 0)
            } else {
                text.transition()
                    .duration(200)
                    .delay(j * 100 + i * 600 + 600)
                    .style("opacity", 1)
            }
        })
        chart.selectAll('path').each(function(_, j) {
            path = d3.select(this)
            if (setup_start) {
                path.style("transform", "scale(0)")

            } else {
                path.transition()
                    .duration(400)
                    .delay(j * 150 + i * 300)
                    .style("transform", "rotate(180deg) scale(0.5)")
                    .transition()
                    .duration(300)
                    .style("transform", "rotate(360deg) scale(0.5)")
                    .transition()
                    .duration(500)
                    .delay(10 * j)
                    .style("transform")
            }
        })
    })
}

function page2_anim(setup_start, save) {
    performance_chart = d3.select("#performance-chart svg")
    performance_chart.selectAll('rect').each(function(_, i) {
        rect = d3.select(this)
        if (setup_start) {
            if (save) {
                rect.attr("save_width", rect.attr("width"))

                if (rect.attr("class") == "bar-home") // pour symétrie
                    rect.style("transform", `translateX(${rect.attr("save_width")}px)`)
            }
            rect.attr("width", 0)
        } else {
            rect.transition()
                .duration(200)
                .delay(i * 100)
                .attr("width", rect.attr("save_width"))
                .style("transform")
        }
    })

    goals_chart = d3.select("#goals-timeline-chart svg")
    goals_chart.selectAll('circle').each(function(_, i) {
        circle = d3.select(this)
        if (setup_start) {
            circle.style("opacity", "0")
        } else {
            circle.transition()
                .duration(300)
                .delay(i * 100)
                .style("opacity", "1")
                .style("transform", "scale(1.09)")
                .transition()
                .duration(200)
                .style("transform")
        }
    })
}
