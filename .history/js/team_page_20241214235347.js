const ctx = { data: {}, teams: {}, players: {}, matches: {} };


const countryToLeague = {
    "england": "Premier League",
    "france": "Ligue 1",
    "germany": "Bundesliga",
    "italy": "Serie A",
    "spain": "La Liga"
};

function loadClubLogos() {
    d3.csv("data/clubs_logo.csv").then(data => {
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

    Promise.all([...teamPromises, ...playerPromises]).then(() => {
        updateTeamsList();
        loadClubLogos(); // Load logos after team data
    }).catch(error => console.error("Error loading the data:", error));
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
    load_data();

    document.getElementById("team1").addEventListener("change", updateStats);
    document.getElementById("season").addEventListener("change", function() {
        updateTeamsList();
        updateStats();
        updateMatchesList();
        
    });

    function updateStats() {
        const team1 = document.getElementById("team1").value;
        const season = document.getElementById("season").value;

        if (team1) {
            let data1;
            console.log(season)
            
            // Create Variables
            const teamLogo = document.getElementById("team-logo");
            const teamNameElement = document.getElementById("team-name");
            const teamLeagueElement = document.getElementById("team-league");
            const logoURL = ctx.logos[team1];
            const teamRankElement= document.getElementById("team-rank");
            const teamRatioElement = document.getElementById("team-ratio");

            if (season === "All Seasons") {
                // Aggregate all the season stastics
                data1 = ctx.teams["2023-2024"].find(team => team.common_name === team1);
            } else if (ctx.teams[season]) {
                data1 = ctx.teams[season].find(team => team.common_name === team1);
            }

            if (!data1) {
                team
                console.error(`No data found for team ${team1} in season ${season}`);
                return;
            }
    
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
            const rank =  data1.league_position ;

            if(season === "All Seasons"){
                teamRankElement.textContent = "Rank: " + rank +" (23-24)";
            }else{
                teamRankElement.textContent = "Rank: " + rank 
            }
            // Update Team Ratio
            const wins =  data1.wins ;
            const losses = data1.losses;
            const draws = data1.draws ;
            const ratio = wins + "/" + losses + "/" + draws;
            teamRatioElement.textContent = ratio
            
            
            createPerformanceChart(data1);
       
        } else {
            document.getElementById("team1-stats").innerHTML = `<p>Please select a team.</p>`;
        }
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
    if (!data) return;
    
    // Clear existing chart
    d3.select("#performance-chart").html("");

    // Define metrics to compare, using exact column names from the CSV
    const metrics = [
        { label: "Matches Played", home: "matches_played_home", away: "matches_played_away" },
        { label: "Wins", home: "wins_home", away: "wins_away" },
        { label: "Draws", home: "draws_home", away: "draws_away" },
        { label: "Losses", home: "losses_home", away: "losses_away" },
        { label: "Points per Game", home: "points_per_game_home", away: "points_per_game_away" },
        { label: "Goals For", home: "goals_scored_home", away: "goals_scored_away" },
        { label: "Goals Against", home: "goals_conceded_home", away: "goals_conceded_away" },
        { label: "Clean Sheets", home: "clean_sheets_home", away: "clean_sheets_away" },
        { label: "Yellow/Red Cards", home: "cards_total_home", away: "cards_total_away" },
        { label: "Possession %", home: "average_possession_home", away: "average_possession_away" }
    ];

    // Process the metrics data
    const processedMetrics = metrics.map(metric => ({
        ...metric,
        homeValue: parseFloat(data[metric.home]) || 0,
        awayValue: parseFloat(data[metric.away]) || 0
    }));

    // Rest of your existing chart creation code...
    const margin = { top: 20, right: 40, bottom: 20, left: 150 };
    const width = 445 - margin.left - margin.right;
    const height = metrics.length * 40;

    const svg = d3.select("#performance-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const maxValue = d3.max(processedMetrics, d => 
        Math.max(Math.abs(d.homeValue), Math.abs(d.awayValue))
    );

    const x = d3.scaleLinear()
        .domain([-maxValue, maxValue])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(metrics.map(d => d.label))
        .range([0, height])
        .padding(0.1);

    // Add vertical center line
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
            .attr("x", x(0) - (x(metric.homeValue) - x(0)) - 5)
            .attr("y", y(metric.label) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(metric.homeValue.toFixed(1));

        svg.append("text")
            .attr("class", "bar-label")
            .attr("x", x(metric.awayValue) + 5)
            .attr("y", y(metric.label) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .text(metric.awayValue.toFixed(1));
    });

    // Add metric labels
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickSize(0))
        .call(g => g.select(".domain").remove());

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(0,${height + 10})`);

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
}
