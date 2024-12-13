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

    // Placeholder data for teams
    const teams = [
        { name: "Team A", stats: { goals: 85, assists: 70, passes: 9000, tackles: 450 } },
        { name: "Team B", stats: { goals: 78, assists: 64, passes: 8700, tackles: 430 } },
        { name: "Team C", stats: { goals: 95, assists: 75, passes: 9200, tackles: 500 } },
    ];

    // Populate team dropdowns
    d3.selectAll(".team-select").selectAll("option")
        .data(teams)
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

        const team1 = teams.find(t => t.name === team1Name);
        const team2 = teams.find(t => t.name === team2Name);

        const metrics = Object.keys(team1.stats);

        const metricScale = d3.scaleLinear()
            .domain([0, d3.max([...Object.values(team1.stats), ...Object.values(team2.stats)])])
            .range([0, 100]);

        // Clear previous comparisons
        d3.selectAll(".team-comparison, .comparison-metrics").html("");

        metrics.forEach(metric => {
            const metricGroup = comparisonDiv.select(".comparison-metrics")
                .append("div")
                .attr("class", "metric-group");

            metricGroup.append("span").attr("class", "metric-name").text(metric);
            metricGroup.append("span").attr("class", "metric-values")
                .text(`${team1.stats[metric]} vs ${team2.stats[metric]}`);

            [team1, team2].forEach((team, idx) => {
                d3.select(`.team${idx + 1}-comparison`)
                    .append("div")
                    .attr("class", "metric-bar")
                    .append("div")
                    .attr("class", `bar team${idx + 1}`)
                    .style("width", `${metricScale(team.stats[metric])}%`);
            });
        });
    }

    // Initialize comparison
    updateComparison();
});
