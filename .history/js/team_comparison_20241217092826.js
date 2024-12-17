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
    document.getElementById("season").addEventListener("change", updateStats);
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
            document.getElementById("team1-stats").innerHTML = `<h2>${team1} Stats (${season})</h2><p>Stats for ${team1} in ${season} will be displayed here.</p>`;
            const team1Logo = document.getElementById("team-logo");
            const team1NameElement = document.getElementById("team-name");
            const team1LeagueElement = document.getElementById("team-league");
            const logoURL1 = ctx.logos[team1];
            const team1RankElement= document.getElementById("team-rank");
            const team1RatioElement = document.getElementById("team-ratio");
        }

        if (team2) {
            document.getElementById("team2-stats").innerHTML = `<h2>${team2} Stats (${season})</h2><p>Stats for ${team2} in ${season} will be displayed here.</p>`;
            const team2Logo = document.getElementById("team-logo");
            const team2NameElement = document.getElementById("team-name");
            const team2LeagueElement = document.getElementById("team-league");
            const logoURL2 = ctx.logos[team1];
            const team2RankElement= document.getElementById("team-rank");
            const team2RatioElement = document.getElementById("team-ratio");
        }

        if (team1 && team2) {
            compareTeams(team1, team2, season);
        }
    }



    function getTeamLogo(teamName) {
        // Replace with actual logic to get the logo URL
        return "https://via.placeholder.com/150";
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
