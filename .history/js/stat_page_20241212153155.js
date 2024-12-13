document.addEventListener("DOMContentLoaded", function() {
    const teams = ["Team A", "Team B", "Team C", "Team D"]; // Example teams, replace with actual data

    const datalist = document.getElementById("teams");
    teams.forEach(team => {
        const option = document.createElement("option");
        option.value = team;
        datalist.appendChild(option);
    });

    document.getElementById("team1").addEventListener("change", updateStats);
    document.getElementById("team2").addEventListener("change", updateStats);

    function updateStats() {
        const team1 = document.getElementById("team1").value;
        const team2 = document.getElementById("team2").value;

        if (team1) {
            document.getElementById("team1-stats").innerHTML = `<h2>${team1} Stats</h2><p>Stats for ${team1} will be displayed here.</p>`;
        }

        if (team2) {
            document.getElementById("team2-stats").innerHTML = `<h2>${team2} Stats</h2><p>Stats for ${team2} will be displayed here.</p>`;
        }
    }
});
