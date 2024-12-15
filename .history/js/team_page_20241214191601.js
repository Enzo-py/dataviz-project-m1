const ctx = {
    teams: {} 
};

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

function updatePlayersList() {
    const team1 = document.getElementById("team1").value;
    const season = document.getElementById("season").value;
    const playersListElement = document.getElementById("players-list");

    if (team1 && season && ctx.players && ctx.players[season]) {
        const players = ctx.players[season].filter(player => player.current_Club === team1);


        if (players.length > 0) {
            players.forEach(player => {
                const playerItem = document.createElement("li");
                // playerItem.textContent = `${player.player_name} - ${player.position}`;
                playersListElement.appendChild(playerItem);
            });
        } else {
            playersListElement.innerHTML = `<p>No players found for ${team1} in ${season}.</p>`;
        }
    } else {
        playersListElement.innerHTML = `<p>Please select a team and season.</p>`;
    }
}


document.addEventListener("DOMContentLoaded", function() {
    load_data();

    document.getElementById("team1").addEventListener("change", updateStats);
    document.getElementById("season").addEventListener("change", function() {
        updateTeamsList();
        updateStats();
    });

    function updateStats() {
        const team1 = document.getElementById("team1").value;
        const season = document.getElementById("season").value;

        if (team1) {
            let data1;
            console.log(season)
            if (season === "All Seasons") {
                // Aggregate all the season stastics
                data1 = ctx.teams["2023-2024"].find(team => team.common_name === team1);
            } else if (ctx.teams[season]) {
                data1 = ctx.teams[season].find(team => team.common_name === team1);
                console.log(data1.league_position)
            }


            // Update info
            // Create Variables
            const teamLogo = document.getElementById("team-logo");
            const teamNameElement = document.getElementById("team-name");
            const teamLeagueElement = document.getElementById("team-league");
            const logoURL = ctx.logos[team1];
            const teamRankElement= document.getElementById("team-rank");
            const teamRatioElement = document.getElementById("team-ratio");
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
            updatePlayersList();
       
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
