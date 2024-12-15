const ctx = {
    teams: {} 
};

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

    const promises = teamFiles.map(file => {
        return d3.csv(file).then(data => {
            const season = file.match(/(\d{4}-\d{4})/)[0];
            if (!ctx.teams[season]) ctx.teams[season] = [];
            ctx.teams[season] = ctx.teams[season].concat(data);
        });
    });

    Promise.all(promises).then(() => {
        updateTeamsList();
    }).catch(error => console.error("Error loading the team data:", error));
}

function updateTeamsList() {
    const allTeams = new Set();
    for (const season in ctx.teams) {
        ctx.teams[season].forEach(teamData => {
            allTeams.add(teamData.TeamName);
        });
    }
    const datalist = document.getElementById("teams");
    datalist.innerHTML = ""; // Clear existing options
    allTeams.forEach(team => {
        const option = document.createElement("option");
        option.value = team;
        datalist.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    load_data();

    document.getElementById("team1").addEventListener("change", updateStats);
    document.getElementById("season").addEventListener("change", updateStats);

    function updateStats() {
        const team1 = document.getElementById("team1").value;
        const season = document.getElementById("season").value;

        if (season && ctx.teams[season]) {
            if (team1) {
                const data1 = ctx.teams[season].find(team => team.TeamName === team1);
                if (data1) {
                    document.getElementById("team1-stats").innerHTML = `<h2>${team1} Stats (${season})</h2><p>${JSON.stringify(data1)}</p>`;
                } else {
                    document.getElementById("team1-stats").innerHTML = `<p>No data available for ${team1} in ${season}.</p>`;
                }
            } else {
                document.getElementById("team1-stats").innerHTML = `<p>Please select a team.</p>`;
            }
        } else {
            document.getElementById("team1-stats").innerHTML = `<p>Please select a valid season.</p>`;
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
