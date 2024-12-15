function load_data() {
    const files = [
        "data/map/nutsbn.geojson", 
        "data/map/nutsrg.geojson",
        "data/clubs_cities.csv",
        "data/map/cities.geojson",
        "data/clubs_logo.csv",
        "data/map/all.geojson"
    ]

    // Load all the data files
    for (const file of files) {

    const promises = files.map(url => url.includes("json") ? d3.json(url) : d3.csv(url))

    Promise.all(promises).then(data => {
        mapped_data = {}
        data.forEach((d, i) => {
            file_name = files[i].split("/").slice(-1)[0].split(".")[0]
            if (mapped_data[file_name] != undefined) {
                console.warn("File name <", file_name, "> already exists, renaming to:", file_name + i)
                file_name += i
            }
            mapped_data[file_name] = d
        })
        ctx.data = mapped_data
        render_map()
    }).catch(error => console.error("Error loading the data:", error))
}

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
    document.getElementById("season").addEventListener("change", updateStats);

    function updateStats() {
        const team1 = document.getElementById("team1").value;
        const team2 = document.getElementById("team2").value;
        const season = document.getElementById("season").value;

        if (team1) {
            document.getElementById("team1-stats").innerHTML = `<h2>${team1} Stats (${season})</h2><p>Stats for ${team1} in ${season} will be displayed here.</p>`;
        }

        if (team2) {
            document.getElementById("team2-stats").innerHTML = `<h2>${team2} Stats (${season})</h2><p>Stats for ${team2} in ${season} will be displayed here.</p>`;
        }
    }
});
