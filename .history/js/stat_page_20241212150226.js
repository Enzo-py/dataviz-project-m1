document.addEventListener("DOMContentLoaded", () => {
    const container = d3.select("#compare-container");

    // Create dropdowns for selecting teams
    const teamSelectDiv = container.append("div").attr("class", "team-select-container");

    ["Team 1", "Team 2"].forEach((label, idx) => {
        const selectGroup = teamSelectDiv.append("div").attr("class", `select-group team${idx + 1}`);
        selectGroup.append("label").text(label);
        selectGroup
            .append("select")
            .attr("class", `team-select team${idx + 1}-select`)
            .on("change", updateComparison);
    });

    // Load data for the three seasons
    const seasons = ["2021-2022", "2022-2023", "2023-2024"];
    const league = "italy-serie-a";
    const dataPromises = seasons.map(season => d3.csv(`/data/All_Data_Cleaned/${league}-teams-${season}-stats.csv`));

    Promise.all(dataPromises).then(dataArrays => {
        const teams = {};

        // Process data for each season
        dataArrays.forEach((data, seasonIdx) => {
            data.forEach(row => {
                const teamName = row.team_name;
                if (!teams[teamName]) {
                    teams[teamName] = { name: teamName, stats: {} };
                }
                seasons.forEach((season, idx) => {
                    if (!teams[teamName].stats[season]) {
                        teams[teamName].stats[season] = { goals: 0, assists: 0, passes: 0, tackles: 0 };
                    }
                });
                teams[teamName].stats[seasons[seasonIdx]].goals += +row.goals_scored;
                teams[teamName].stats[seasons[seasonIdx]].assists += +row.assists;
                teams[teamName].stats[seasons[seasonIdx]].passes += +row.passes;
                teams[teamName].stats[seasons[seasonIdx]].tackles += +row.tackles;
            });
        });

        const teamList = Object.values(teams);

        // Populate team dropdowns
        d3.selectAll(".team-select").selectAll("option")
            .data(teamList)
            .enter()
            .append("option")
            .attr("value", d => d.name)
            .text(d => d.name);

        // Create comparison area
        const comparisonDiv = container.append("div").attr("class", "comparison-container");

        comparisonDiv
            .append("div")
            .attr("class", "team-comparison team1-comparison");

        comparisonDiv
            .append("div")
            .attr("class", "comparison-metrics");

        comparisonDiv
            .append("div")
            .attr("class", "team-comparison team2-comparison");

        function updateComparison() {
            const team1Name = d3.select(".team1-select").property("value");
            const team2Name = d3.select(".team2-select").property("value");

            const team1 = teams[team1Name];
            const team2 = teams[team2Name];

            const metrics = ["goals", "assists", "passes", "tackles"];

            const metricScale = d3.scaleLinear()
                .domain([0, d3.max([...metrics.flatMap(metric => Object.values(team1.stats).map(s => s[metric])), ...metrics.flatMap(metric => Object.values(team2.stats).map(s => s[metric]))])])
                .range([0, 100]);

            // Clear previous comparisons
            d3.selectAll(".team-comparison, .comparison-metrics").html("");

            metrics.forEach(metric => {
                const metricGroup = comparisonDiv.select(".comparison-metrics")
                    .append("div")
                    .attr("class", "metric-group");

                metricGroup.append("span").attr("class", "metric-name").text(metric);
                metricGroup.append("span").attr("class", "metric-values")
                    .text(`${team1.stats[seasons[0]][metric]} vs ${team2.stats[seasons[0]][metric]} (${seasons[0]})`);

                [team1, team2].forEach((team, idx) => {
                    d3.select(`.team${idx + 1}-comparison`)
                        .append("div")
                        .attr("class", "metric-bar")
                        .append("div")
                        .attr("class", `bar team${idx + 1}`)
                        .style("width", `${metricScale(team.stats[seasons[0]][metric])}%`);
                });
            });
        }

        // Initialize comparison
        updateComparison();
    });
});
