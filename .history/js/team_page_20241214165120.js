const ctx = {
    teams: {} // Changed to an object to store data by season
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
    document.getElementById("team2").addEventListener("change", updateStats);
    document.getElementById("season").addEventListener("change", updateStats);

    function updateStats() {
        const team1 = document.getElementById("team1").value;
        const team2 = document.getElementById("team2").value;
        const season = document.getElementById("season").value;

        if (season && ctx.teams[season]) {
            if (team1) {
                const data1 = ctx.teams[season].find(team => team.TeamName === team1);
                if (data1) {
                    document.getElementById("team1-stats").innerHTML = `<h2>${team1} Stats (${season})</h2><p>${JSON.stringify(data1)}</p>`;
                } else {
                    document.getElementById("team1-stats").innerHTML = `<p>No data available for ${team1} in ${season}.</p>`;
                }
            }

            if (team2) {
                const data2 = ctx.teams[season].find(team => team.TeamName === team2);
                if (data2) {
                    document.getElementById("team2-stats").innerHTML = `<h2>${team2} Stats (${season})</h2><p>${JSON.stringify(data2)}</p>`;
                } else {
                    document.getElementById("team2-stats").innerHTML = `<p>No data available for ${team2} in ${season}.</p>`;
                }
            }
        } else {
            document.getElementById("team1-stats").innerHTML = `<p>Please select a valid season.</p>`;
            document.getElementById("team2-stats").innerHTML = `<p>Please select a valid season.</p>`;
        }
    }
});

