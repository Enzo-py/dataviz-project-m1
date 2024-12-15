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


To transform the team stats visualization to match the layout shown in the image, I can provide HTML and CSS modifications for structuring the stats display. Here's an updated script and structure that uses your layout:

Updated Code
html
Copier le code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Stats</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        #team-stats {
            width: 80%;
            max-width: 1200px;
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            grid-template-rows: auto auto 1fr auto;
            gap: 10px;
            background-color: #004466;
            color: white;
            padding: 20px;
            border-radius: 10px;
        }
        #team-logo {
            grid-row: 1 / span 2;
            grid-column: 1;
            background-color: #00334d;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            border-radius: 5px;
        }
        #team-info {
            grid-row: 1 / 2;
            grid-column: 2;
            background-color: #005580;
            padding: 10px;
            border-radius: 5px;
        }
        #team-results {
            grid-row: 1 / 2;
            grid-column: 3;
            background-color: #005580;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            border-radius: 5px;
        }
        #team-season {
            grid-row: 2 / 3;
            grid-column: 2;
            background-color: #006699;
            padding: 10px;
            border-radius: 5px;
        }
        #player-link {
            grid-row: 2 / 3;
            grid-column: 3;
            background-color: #006699;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: underline;
            border-radius: 5px;
        }
        #general-info {
            grid-row: 3 / 4;
            grid-column: 1;
            background-color: #0077aa;
            padding: 10px;
            border-radius: 5px;
        }
        #additional-info {
            grid-row: 3 / 4;
            grid-column: 2 / span 2;
            background-color: #0077aa;
            padding: 10px;
            border-radius: 5px;
        }
        #buttons {
            grid-row: 4 / 5;
            grid-column: 3;
            display: flex;
            justify-content: space-between;
        }
        .button {
            background-color: #005580;
            color: white;
            padding: 10px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="team-stats">
        <div id="team-logo">Logo</div>
        <div id="team-info">
            <h2>Team Name</h2>
            <p>League / Rank</p>
        </div>
        <div id="team-results">
            <p>Win / Lose / Neutral</p>
        </div>
        <div id="team-season">
            <p>Year: 2023</p>
        </div>
        <div id="player-link">
            <a href="#">Go to Player List</a>
        </div>
        <div id="general-info">
            <h3>General Info</h3>
            <p>Additional details about the team.</p>
        </div>
        <div id="additional-info">Match List or other details...</div>
        <div id="buttons">
            <button class="button">Retour</button>
            <button class="button">Compare</button>
        </div>
    </div>
</body>
</html>
JavaScript Integration
Integrate this layout with the existing JavaScript logic by dynamically populating the sections (e.g., #team-logo, #team-info, #team-results) with the selected team stats. Update the updateStats function as follows:

javascript
Copier le code
function updateStats() {
    const team1 = document.getElementById("team1").value;
    const season = document.getElementById("season").value;

    if (season && ctx.teams[season]) {
        const data1 = ctx.teams[season].find(team => team.TeamName === team1);
        if (data1) {
            document.getElementById("team-logo").textContent = "Team Logo Here";
            document.getElementById("team-info").innerHTML = `<h2>${data1.TeamName}</h2><p>${data1.League} / ${data1.Rank}</p>`;
            document.getElementById("team-results").textContent = `${data1.Wins} / ${data1.Losses} / ${data1.Draws}`;
            document.getElementById("team-season").textContent = `Year: ${season}`;
            document.getElementById("general-info").innerHTML = `<h3>General Info</h3><p>${data1.GeneralInfo || "No additional details."}</p>`;
            document.getElementById("additional-info").textContent = "Match List or other details...";
        } else {
            alert(`No data available for ${team1} in ${season}.`);
        }
    }