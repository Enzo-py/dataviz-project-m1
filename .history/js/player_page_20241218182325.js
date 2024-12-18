ctx = {
    data: {},
    selected_players: {},
    rScale: {},
    color_index: 0,
    distribution_chart_height: 100,
    distribution_chart_width: 300,
}

RADAR_CATEGORIES = ['DISCIPLINE', 'DEFENDING', 'VISION', 'ASSISTS', 'SCORING', 'ATTACKING', 'POSSESION_&_CONTROL', 'PHYSICAL_STATS', 'PASSING', 'PLAYING_TIME', 'GOALKEEPER']
// changer aussi dans le fichier JSON (pour permettre load et display async)

let VALUES_CARD_STATS = {}

COLORS = ["#e35763", "#f4ca13", "#68a068", "#436ebf", "#55b3e7", "#9364e3"]

function get_color() {
    available_colors = COLORS.filter(color => !Object.values(ctx.selected_players).includes(color))
    return available_colors[0]
}

async function setup_radar() {
    create_radar("#spider-chart-2021-2022", RADAR_CATEGORIES)
    create_radar("#spider-chart-2022-2023", RADAR_CATEGORIES)
    create_radar("#spider-chart-2023-2024", RADAR_CATEGORIES)
}

function load_data() {
    const files = [
        './data/players/england-2021-2022.csv',
        './data/players/england-2022-2023.csv',
        './data/players/england-2023-2024.csv',
        './data/players/france-2021-2022.csv',
        './data/players/france-2022-2023.csv',
        './data/players/france-2023-2024.csv',
        './data/players/germany-2021-2022.csv',
        './data/players/germany-2022-2023.csv',
        './data/players/germany-2023-2024.csv',
        './data/players/italy-2021-2022.csv',
        './data/players/italy-2022-2023.csv',
        './data/players/italy-2023-2024.csv',
        './data/players/spain-2021-2022.csv',
        './data/players/spain-2022-2023.csv',
        './data/players/spain-2023-2024.csv',
        './data/nationalities_flag.csv',
        './data/clubs_logo.csv',
        './data/player_card_stats.json',
        './data/players_radar_categories.json',
        './data/img/soccer_wiki.json'
    ]

    d3.select("body .players-view")
            .insert("div", ":first-child")
            .attr("class", "loader")
            .text("Loading data...")

    setup_radar() // to make some animations in order to wait for the data to load

    const promises = files.map(url => url.includes("json") ? d3.json(url) : d3.csv(url))

    Promise.all(promises).then(data => {
        mapped_data = {}
        data.forEach((d, i) => {
            file_name = files[i].split("/").slice(-1)[0].split(".")[0]
            if (files[i].includes("players/")) file_name = "@players-" + file_name

            if (mapped_data[file_name] != undefined) {
                console.warn("File name <", file_name, "> already exists, renaming to:", file_name + i)
                file_name += i
            }
            mapped_data[file_name] = d
        })
        ctx.data = mapped_data

        setTimeout(() => {
            agg_players_data()
        }, 1200)

        const intervalId = setInterval(() => {
            if (ctx.ready) {
                // remove the loader
                d3.select(".loader").transition()
                    .duration(500)
                    .style("transform", "translateY(-200px)")
                    .remove()

                populate_players()

                clearInterval(intervalId)
            }
        }, 500)
    }).catch(error => {
        d3.select(".loader").text("Python server error, please reload").style("color", "red")
        setTimeout(() => {
            d3.select(".loader").transition()
                .duration(500)
                .style("transform", "translateY(-200px)")
                .remove()
            load_data()
        }, 1000)
    })
}

function get_player_id(player) {
    player_name = player["full_name"].replaceAll(" ", "-").toLowerCase()
    return player_name + '-' + player["birthday"]
}

function agg_players_data() {
    ctx.data["players_agg"] = {}
    Object.keys(ctx.data).forEach(key => {
        if (key.includes("@players-")) {
            date = key.split("-") // [players, country, year1, year2]
            date = date.slice(2).join("-") // year1-year

            ctx.data[key].forEach(player => {
                player_id = get_player_id(player)
                if (ctx.data["players_agg"][player_id] == undefined) {
                    ctx.data["players_agg"][player_id] = {
                        [date]: player
                    }
                } else {
                    ctx.data["players_agg"][player_id][date] = player
                }

                // if player rank = -1 rank = 999
                Object.keys(player).forEach(key => {
                    if (key.includes("rank") && player[key] == -1) {
                        player[key] = 999
                    }
                })
            })
        }
    })

    // Object.keys(ctx.data["players_agg"]).forEach(playerId => {
    //     Object.keys(ctx.data["players_agg"][playerId]).forEach(season => {
    //         player_data = ctx.data["players_agg"][playerId][season]
            
    //         // normalize the data by category

            
    //     });
    // });

    // normalize the data with minmax
    // 1. get the min and max for each column
    minmax = {}
    Object.keys(ctx.data["players_agg"]).forEach(playerId => {
        Object.keys(ctx.data["players_agg"][playerId]).forEach(season => {
            player_data = ctx.data["players_agg"][playerId][season]
            
            Object.keys(player_data).forEach(key => {
                if (minmax[key] == undefined) {
                    minmax[key] = {
                        min: player_data[key],
                        max: player_data[key]
                    }
                } else {
                    minmax[key].min = Math.min(minmax[key].min, player_data[key])
                    minmax[key].max = Math.max(minmax[key].max, player_data[key])
                }
            });
        });
    });

    // 2. normalize the data by category
    Object.keys(ctx.data["players_agg"]).forEach(playerId => {
        Object.keys(ctx.data["players_agg"][playerId]).forEach(season => {
            player_data = ctx.data["players_agg"][playerId][season]

            Object.keys(ctx.data["players_radar_categories"]).forEach(category => {
                cols = ctx.data["players_radar_categories"][category]["cols"]
                total_values = 0
                nb_values = 0

                Object.keys(cols).forEach(col => {
                    inverse = false
                    bonus = false
                    ponderation = cols[col]
                    if (String(col).includes("@bonus-")) {
                        col = col.split("@bonus-")[1]
                        bonus = true
                    }
                    if (String(col).includes("@inverse-")) {
                        col = col.split("@inverse-")[1]
                        inverse = true
                    }
                    // normalize the data
                    // category_values[col] = (player_data[col] - minmax[col].min) / (minmax[col].max - minmax[col].min)
                    value = (player_data[col] - minmax[col].min) / (minmax[col].max - minmax[col].min) * ponderation
                    total_values += inverse ? 1 - value : value
                    nb_values += bonus ? 0 : ponderation
                })

                ctx.data["players_agg"][playerId][season][category] = Math.min(total_values / nb_values, 1)
            })
        });
    })

    // redo the same but for player card
    VALUES_CARD_STATS = {}
    Object.keys(ctx.data["players_agg"]).forEach(player_id => {
        player = ctx.data["players_agg"][player_id]
        cards_stats = {}
        nb_player_seasons = Object.keys(player).length

        Object.keys(ctx.data["player_card_stats"]).forEach(category => {
            indicators = ctx.data["player_card_stats"][category]
            Object.keys(indicators).forEach(indicator => {
                cols = indicators[indicator]['stats']

                nb_values = 0
                avg_cols_over_seasons = Object.keys(cols).map(col => {
                    ponderation = parseFloat(cols[col])
                    inversed = false
                    bonus = false

                    if (String(col).includes("@bonus-")) {
                        col = col.split("@bonus-")[1]
                        bonus = true
                    } 
                    if (String(col).includes("@inverse-")) {
                        col = col.split("@inverse-")[1]
                        inversed = true
                    }
                    
                    return Object.keys(player).reduce((acc, season) => {
                        if (minmax[col] == undefined) return acc
                        value = isNaN(player[season][col]) ? 0 : player[season][col]
                        minmax_value = (value - minmax[col].min) / (minmax[col].max - minmax[col].min)
                        if (inversed) minmax_value = 1 - minmax_value
                        
                        nb_values += bonus ? 0 : ponderation
                        return acc + minmax_value * ponderation
                    }, 0)
                })

                final_value = avg_cols_over_seasons.reduce((acc, cur) => acc + cur, 0) / nb_values
                focus_roles = indicators[indicator]['position_filter']
                if (focus_roles === null) {}
                else if (focus_roles.includes(player[Object.keys(player)[0]]["position"])) final_value *= 1.1
                else final_value *= 0.9


                
                cards_stats[indicator] = final_value - (3 - nb_player_seasons) * final_value * 0.1
            })
        })
        VALUES_CARD_STATS[player_id] = cards_stats
    })

    ctx.ready = true
}    


function populate_players() {
    // transform the data to a object: nationality -> flag
    ctx.data["nationalities_flag"] = ctx.data["nationalities_flag"].reduce((acc, cur) => {
        acc[cur["Nationality"]] = cur["Flag_URL"]
        return acc
    })

    // transform the data to a object: club -> logo
    ctx.data["clubs_logo"] = ctx.data["clubs_logo"].reduce((acc, cur) => {
        acc[cur["Club"]] = cur["Logo_URL"]
        return acc
    })


    table_body = d3.select(".players-view table tbody")
    Object.keys(ctx.data["players_agg"]).forEach(player_id => {
        player = ctx.data["players_agg"][player_id]
        last_year = Object.keys(player).sort()[Object.keys(player).length - 1]
        table_row = table_body.append("tr")
        years = Object.keys(player).sort()
        current_club = player[last_year]["Current_Club"]
        player_name = player[last_year]["full_name"]
        nationality = player[last_year]["nationality"]
        age = player[last_year]["age"]
        position = player[last_year]["position"]
        score = get_player_score(player_id, position)

        table_row.append("td").text(current_club)
        table_row.append("td").text(player_name)
        table_row.append("td").text(age)
        table_row.append("td").text(score)
        table_row.append("td").text(position)
        table_row.append("td").append("img").attr("src", ctx.data["nationalities_flag"][nationality])
        table_row.attr("id", player_id)
            .attr("player_name", player_name.toLowerCase())
            .attr("current_club", current_club.toLowerCase())
            .attr("position", position)
            .attr("nationality", nationality)
            .attr("age", age)
            .attr("score", score + "%")
            .attr("is-visible", "true")
            .style("display", "none")
            

        table_row.on("click", function() {
            player_id = this.id
            if (Object.keys(ctx.selected_players).includes(player_id)) {
                // selected player is an object, remove it
                delete ctx.selected_players[player_id]
                d3.select(this).classed("selected", false)

                // remove the event on the row
                d3.select(this).on("mouseover", null).on("mouseout", null)

            } else {
                if (Object.keys(ctx.selected_players).length >= COLORS.length) {
                    toast('warning', `You can't select more than ${COLORS.length} players`)
                    return
                }
                // player_id =  color
                ctx.selected_players[player_id] = get_color()
                d3.select(this).classed("selected", true)
                // add event to the row on over to highlight the player in the radar chart
                d3.select(this).on("mouseover", function() {
                    radar_area = d3.selectAll(`path[player-id="${player_id}"]`)
                    radar_area.dispatch("mouseover")
                }).on("mouseout", function() {
                    radar_area = d3.selectAll(`path[player-id="${player_id}"]`)
                    radar_area.dispatch("mouseout")
                })
            }

            update_players_charts()
            update_players_tags()
        })
    })

    // Inform the document that the page is ready
    setTimeout(() => {
        document.dispatchEvent(new Event('ready'));
        d3.select("body").attr("ready", "true");
    }, 800);

    // add nationalities to the filter
    nationalities = Object.keys(ctx.data["nationalities_flag"]).filter(n => n != "Flag_URL").sort()
    nationality_select = d3.select("#nationality-select")
    nationality_select.selectAll("option")
        .data(nationalities)
        .enter()
        .append("option")
        .text(d => d)


    // pre draw distribution chart
    Object.keys(ctx.data["player_card_stats"]).forEach(category => {
        indicators = ctx.data["player_card_stats"][category]
        Object.keys(indicators).forEach(indicator => {
            draw_distribution_chart(indicator)
        })
    })
}

function pagination(animation) {
    var table = document.querySelector('table');
    var rows = table.querySelectorAll('tr[is-visible="true"]');
    var rpp = 15 - 1; // rows per page
    var rows_length = rows.length;

    for (var i = 0; i < rows_length; i++) {
        if (i > rpp) {
            rows[i].style.display = 'none';
        }
    }

    var pageCount = Math.ceil((rows_length - 1) / rpp);
    var pagination = document.getElementById('pagination');

    // empty the pagination
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }

    for (var i = 0; i < pageCount; i++) {
        var page = document.createElement('span');
        if (i == 1) {
            dots_page = document.createElement('span');
            dots_page.innerHTML = '...';
            dots_page.style.display = 'none';
            dots_page.setAttribute('id', 'dots_page_start');
            dots_page.classList.add('dots_page');
            pagination.appendChild(dots_page);
        }
        if (i == pageCount - 1) {
            dots_page = document.createElement('span');
            dots_page.innerHTML = '...';
            dots_page.style.display = 'none';
            dots_page.setAttribute('id', 'dots_page_end');
            dots_page.classList.add('dots_page');
            pagination.appendChild(dots_page);
        }
        page.innerHTML = i + 1;
        page.setAttribute('id', 'page' + (i + 1));
        page.onclick = function () {
            var p = parseInt(this.innerHTML);

            // deselect all other pages and select the 3 pages around the current page
            for (var j = 1; j <= pageCount; j++) {
                if (j != p) {
                    document.getElementById('page' + j).removeAttribute('class');
                }

                if (j < p - 3 || j > p + 3) {
                    document.getElementById('page' + j).style.display = 'none';
                } else {
                    document.getElementById('page' + j).style.display = '';
                }
            }
            this.classList.add('selected');
            
            for (var j = 0; j < rows_length; j++) {
                if (j >= rpp * (p - 1) && j < rpp * p) {
                    rows[j].style.display = '';
                } else {
                    rows[j].style.display = 'none';
                }
            }

            // si la dernière page n'est pas afficher, on l'affiche ainsi que ...
            if (p < pageCount - 3) {
                document.getElementById('dots_page_end').style.display = '';
                document.getElementById('page' + pageCount).style.display = '';
            } else if (pageCount > 6) {
                document.getElementById('dots_page_end').style.display = 'none';
            }
            if (p > 4) {
                document.getElementById('dots_page_start').style.display = '';
                document.getElementById('page1').style.display = '';

            // vérifier s'il y  a suffisamment de pages pour afficher les ...
            } else if (pageCount > 6) {
                document.getElementById('dots_page_start').style.display = 'none';
            }
        }
        pagination.appendChild(page);
    }

    // select the first page
    if (document.getElementById('page1') != null) document.getElementById('page1').click();

    if (animation !== undefined && animation) {
        // anim visible tr sur la current page
        current_page_tr = d3.selectAll("tr[is-visible='true']").filter(function() {
            return this.style.display != 'none'
        })
        current_page_tr.each(function(d, i) {
            var tr = d3.select(this);
            delay = i;
            tr.style("transition", "none").style("transform", "scale(0)").style("transform-origin", "top").style("display", "none")
                .transition()
                .duration(500)
                .delay(delay * 40)
                .style("display", "")
                .style("transform", "scale(1.02)")
                .transition()
                .duration(200)
                .style("transform")
                .style("transition", "all 0.3s")
        });

        pagination = d3.select("#pagination")
        pagination.style("transform", "scale(0)").style("transform-origin", "left")
            .transition()
            .delay(100 * rpp + 400)
            .duration(300)
            .style("transform", "scale(1.04)")
            .transition()
            .duration(100)
            .style("transform")
    }
    
}

function sort_player_table(club, player_name, age, score, position, nationality, animation_pagination) {
    params_by_reverse_order = [
        {param: club, attr_name: "current_club"},
        {param: player_name, attr_name: "player_name"},
        {param: age, attr_name: "age"},
        {param: score, attr_name: "score"},
        {param: position, attr_name: "position"},
        {param: nationality, attr_name: "nationality"}
    ]

    params_by_reverse_order = params_by_reverse_order.filter(param => param.param != null)
    params_by_reverse_order = params_by_reverse_order.sort((a, b) => d3.ascending(a.param.index, b.param.index))
    tbody = d3.select(".players-view table tbody");

    let trs = Array.from(tbody.selectAll("tr").nodes());
    // Fonction de tri des trs selon les params fournies
    trs.sort(function(a, b) {
        for (let key in params_by_reverse_order) {
            const param = params_by_reverse_order[key];
            const aValue = a.getAttribute(param.attr_name);
            const bValue = b.getAttribute(param.attr_name);
            
            // Conversion en nombres si possible
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);

            if (!isNaN(aNum) && !isNaN(bNum)) {
                if (aNum < bNum) return param.param.order === "asc" ? -1 : 1;
                if (aNum > bNum) return param.param.order === "asc" ? 1 : -1;
            } else {
                if (aValue < bValue) return param.param.order === "asc" ? -1 : 1;
                if (aValue > bValue) return param.param.order === "asc" ? 1 : -1;
            }
            // Si les valeurs sont égales, passer au paramètre suivant
        }
        return 0;
    });
    
    // Réinsérer les lignes triées dans le <tbody>
    tbody.selectAll("tr").remove();
    const tbodyNode = tbody.node();
    trs.forEach(node => tbodyNode.appendChild(node));
    pagination(animation_pagination)
}

function table_filter(players, positions, clubs, nationality) {
    table = d3.select(".players-view table tbody")
    table.selectAll("tr").style("display", "none").attr("is-visible", "false")

    table.selectAll("tr").filter(function() {
        return (players === null || players.toLowerCase().includes(this.getAttribute("player_name")) || this.getAttribute("player_name").includes(players.toLowerCase())) &&
            (positions === null || positions == this.getAttribute("position")) &&
            (clubs === null || clubs.toLowerCase().includes(this.getAttribute("current_club")) || this.getAttribute("current_club").includes(clubs.toLowerCase())) &&
            (nationality === null || nationality.includes(this.getAttribute("nationality")) || this.getAttribute("nationality").includes(nationality))
    }).style("display", "").attr("is-visible", "true")

    pagination()
}

function create_radar(svg_id, categories) {
    // Dimensions du graphique
    const width = 325;
    const height = 325;

    // Configuration du radar chart
    const config = {
        w: width,
        h: height,
        levels: 5,
        maxValue: 1,
        color: d3.scaleOrdinal(d3.schemeCategory10)
    };

    // Sélection du conteneur SVG
    const svg = d3.select(svg_id)
        .attr("width", config.w + 150)
        .attr("height", config.h + 150)
        .append("g")
        .attr("transform", `translate(${config.w / 2 + 75}, ${config.h / 2 + 75})`);

    const totalAxes = categories.length;
    const radius = Math.min(config.w / 2, config.h / 2);
    const angleSlice = 2 * Math.PI / totalAxes;

    // Échelle radiale
    const rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, config.maxValue]);

    ctx.rScale[svg_id] = rScale

    // Grille circulaire
    svg.selectAll(".levels")
        .data(d3.range(1, (config.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", d => (radius / config.levels) * d)
        .style("fill", "#999")
        .style("stroke", "#999")
        .style("fill-opacity", 0.03)
        .style("transform", "scale(0)")
        .transition()
        .duration(500)
        .delay((d, i) => i * 100)
        .style("transform", "scale(1.1)")
        .transition()
        .duration(200)
        // remove the transform
        .style("transform")

    // Axes
    const axis = svg.selectAll(".axis")
        .data(categories)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(config.maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => rScale(config.maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("stroke", "#555")
        .style("stroke-width", "1.5px")
        .style("transform", (d, i) => `rotate(${i * 180 / totalAxes}deg)`)
        .style("transform-origin", "0 0")
        .style("opacity", "0")
        .transition()
        .duration(500)
        .delay((d, i) => i * 15 + 700)
        .style("opacity", "1")
        .style("transform", "rotate(0deg)")

    axis.append("text")
        .attr("class", "legend")
        .attr("x", (d, i) => rScale(config.maxValue * 1.25) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(config.maxValue * 1.25) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("text-anchor", "middle")
        .text(d => d.replaceAll("_", " "))
        .style("font-size", "11px")
        .style("opacity", "0")
        .transition()
        .delay((d, i) => i * 60 + 500)
        .style("opacity", "1")

}

function drawRadarChart(svgId, data) {

    rScale = ctx.rScale[svgId]

    // Ligne radar
    const radarLine = d3.lineRadial()
        .radius(d => rScale(d.value))
        .angle((d, i) => i * angleSlice)
        .curve(d3.curveLinearClosed);

    const totalAxes = data[0].axes.length;
    const angleSlice = 2 * Math.PI / totalAxes;

    svg = d3.select(svgId).select("g")
    // Création des "blobs"
    const blobWrapper = svg.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    // Remplissage des zones
    blobWrapper.append("path")
        .attr("class", "radarArea")
        .attr("d", d => radarLine(d.axes))
        .attr("player-id", d => d.player_id)
        .style("fill", d => d.color)
        .style("fill-opacity", 0.2)
        .style("stroke", d => d.color)
        .style("stroke-width", "2px")
        // hover effect: glow + display name
        .on("mouseover", function(event, d) {
            const area = d3.select(this);
            area.style("fill-opacity", 0.8);
            area.style("stroke", d3.rgb(d.color).darker());
            area.style("stroke-width", "2px");

            // raise area to the top
            // get parentNode
            parent = d3.select(this.parentNode)
            parent.raise()

        })
        .on("mouseout", function() {
            d3.select(this).style("fill-opacity", 0.2);
        })
        .append("title")
        .text(d => d.name)

    // Contours des zones
    // blobWrapper.append("path")
    //     .attr("class", "radarStroke")
    //     .attr("d", d => radarLine(d.axes))
    //     .style("stroke-width", "2px")
    //     .style("stroke", (d, i) => config.color(i))
    //     .style("fill", "none");

    // // Points sur les axes
    // blobWrapper.selectAll(".radarCircle")
    //     .data(d => d.axes)
    //     .enter().append("circle")
    //     .attr("class", "radarCircle")
    //     .attr("r", 4)
    //     .attr("cx", d => rScale(d.value) * Math.cos(angleSlice * d.axisIndex - Math.PI / 2))
    //     .attr("cy", d => rScale(d.value) * Math.sin(angleSlice * d.axisIndex - Math.PI / 2))
    //     .style("fill", (d, i, nodes) => config.color(nodes[i].parentNode.__data__.__index__))        
    //     .style("fill-opacity", 0.8);
}

function update_players_tags() {
    tags_wrapper = d3.select(".players-tags")
    // tags_wrapper.selectAll("span").remove()
    // tags_wrapper.selectAll("span")
    //     .data(Object.keys(ctx.selected_players))
    //     .enter()
    //     .append("span")
    //     .text(player_id => ctx.data["players_agg"][player_id][Object.keys(ctx.data["players_agg"][player_id])[0]]["full_name"])
    //     .style("background-color", player_id => ctx.selected_players[player_id])
    //     .on("click", function(event, player_id) {
    //         delete ctx.selected_players[player_id]
    //         // unselect the player
    //         d3.select(`tr#${player_id}`).classed("selected", false)
    //         d3.select(this).remove()
    //         update_players_charts()
    //     })
    //     // on over, over the player in the radar chart
    //     .on("mouseover", function(event, player_id) {
    //         radar_area = d3.selectAll(`path[player-id="${player_id}"]`)
    //         radar_area.dispatch("mouseover")
    //     })
    //     .on("mouseout", function(event, player_id) {
    //         radar_area = d3.selectAll(`path[player-id="${player_id}"]`)
    //         radar_area.dispatch("mouseout")
    //     })
    //     .style("cursor", "pointer")
    //     .style("color", "white")

    // join data: remove the tags that are not in the selected players; add the new tags; don't touch the existing tags
    tags_wrapper.selectAll("span")
        .data(Object.keys(ctx.selected_players), d => d)
        .join(
            enter => enter.append("span")
                .text(player_id => ctx.data["players_agg"][player_id][Object.keys(ctx.data["players_agg"][player_id])[0]]["full_name"])
                .style("background-color", player_id => ctx.selected_players[player_id])
                .on("click", function(event, player_id) {
                    delete ctx.selected_players[player_id]
                    // unselect the player
                    d3.select(`tr#${player_id}`).classed("selected", false)
                    d3.select(this).transition()
                        .style("text-overflow", "clip")
                        .style("white-space", "nowrap")
                        .duration(400)
                        .style("transform", "scale(0)")
                        .style("width", "0px")
                        .style("margin", "0px")
                        .style("padding", "0px")
                        .remove()
                    update_players_charts()
                })
                // on over, over the player in the radar chart
                .on("mouseover", function(event, player_id) {
                    radar_area = d3.selectAll(`path[player-id="${player_id}"]`)
                    radar_area.dispatch("mouseover")
                })
                .on("mouseout", function(event, player_id) {
                    radar_area = d3.selectAll(`path[player-id="${player_id}"]`)
                    radar_area.dispatch("mouseout")
                })
                .style("cursor", "pointer")
                .style("color", "white"),
            update => update,
            exit => {
                // 1 animation scale down
                exit.transition()
                    .style("text-overflow", "clip")
                    .style("white-space", "nowrap")
                    .duration(400)
                    .style("transform", "scale(0)")
                    .style("width", "0px")
                    .style("margin", "0px")
                    .style("padding", "0px")
                    .remove()
            }
        )
}

function update_players_charts() {
    // select the players data
    players_data = Object.keys(ctx.selected_players).map(player_id => ctx.data["players_agg"][player_id])


    current_player_2021_2022 = players_data.filter(player => Object.keys(player).includes("2021-2022"))
    const data_2021_2022 = current_player_2021_2022.map(player => {
        return {
            name: player["2021-2022"]["full_name"],
            player_id: get_player_id(player["2021-2022"]),
            color: ctx.selected_players[get_player_id(player["2021-2022"])],
            axes: RADAR_CATEGORIES.map((category, i) => {
                return {
                    axis: category,
                    value: player["2021-2022"][category],
                    axisIndex: i
                }
            })
        }
    })


    current_player_2022_2023 = players_data.filter(player => Object.keys(player).includes("2022-2023"))
    const data_2022_2023 = current_player_2022_2023.map(player => {
        return {
            name: player["2022-2023"]["full_name"],
            player_id: get_player_id(player["2022-2023"]),
            color: ctx.selected_players[get_player_id(player["2022-2023"])],
            axes: RADAR_CATEGORIES.map((category, i) => {
                return {
                    axis: category,
                    value: player["2022-2023"][category],
                    axisIndex: i
                }
            })
        }
    })

    current_player_2023_2024 = players_data.filter(player => Object.keys(player).includes("2023-2024"))
    const data_2023_2024 = current_player_2023_2024.map(player => {
        return {
            name: player["2023-2024"]["full_name"],
            player_id: get_player_id(player["2023-2024"]),
            color: ctx.selected_players[get_player_id(player["2023-2024"])],
            axes: RADAR_CATEGORIES.map((category, i) => {
                return {
                    axis: category,
                    value: player["2023-2024"][category],
                    axisIndex: i
                }
            })
        }
    })
    d3.select("#spider-chart-2021-2022").selectAll(".radarWrapper").remove()
    d3.select("#spider-chart-2022-2023").selectAll(".radarWrapper").remove()
    d3.select("#spider-chart-2023-2024").selectAll(".radarWrapper").remove()

    // create player card
    // d3.select(".players-card").selectAll(".player-card").remove()
    // Object.keys(ctx.selected_players).forEach(player_id => {
    //     create_player_card(player_id)
    // })
    // use un select all join update exit
    d3.select(".players-card").selectAll(".player-card")
        .data(Object.keys(ctx.selected_players), d => d)
        .join(
            enter => enter.append('div')
                .attr("class", "player-card")
                .attr("id", player_id)
                .each((d, i, nodes) => create_player_card(d, d3.select(nodes[i]))),
            update => update,
            exit => exit.style("transform-origin", "0 0").style("overflow", "hidden").transition()
                .duration(200)
                .style("transform", "scale(1.03)")
                .transition()
                .duration(700)
                .style("transform", "scale(0)")
                .style("opacity", 0)
                .style("height", "0px")
                .style("width", "0px")
                .style("border", "none")
                .style("padding", "0px")
                .transition()
                .remove()
        )

    // plot category  for the selected players
    if (current_player_2021_2022.length > 0) drawRadarChart("#spider-chart-2021-2022", data_2021_2022)
    if (current_player_2022_2023.length > 0) drawRadarChart("#spider-chart-2022-2023", data_2022_2023)
    if (current_player_2023_2024.length > 0) drawRadarChart("#spider-chart-2023-2024", data_2023_2024)
}

function sum_dict(dict) {
    v = 0
    Object.keys(dict).forEach(key => {
        v += parseFloat(dict[key])
    })
    return v
}

function create_player_card(player_id, player_card) {
    const seuils = {
        0.1: "very-low",
        0.2: "low",
        0.3: "medium",
        0.5: "high",
        0.7: "very-high",
        0.9: "excellent"
    }

    player = ctx.data["players_agg"][player_id]
    player_name = player[Object.keys(player)[0]]["full_name"]
    player_position = player[Object.keys(player)[0]]["position"]
    player_club = player[Object.keys(player)[0]]["Current_Club"]
    player_nationality = player[Object.keys(player)[0]]["nationality"]
    player_number = parseInt(player[Object.keys(player)[0]]["shirt_number"])

    // player_card = d3.select(`.players-card .player-card#${player_id}`)
    player_card.style("border-color", ctx.selected_players[player_id])

    head_card = player_card.append("div").attr("class", "head-card")
    player_identity = head_card.append("div").attr("class", "player-identity")

    player_identity.append("span").text(player_number).style("color", ctx.selected_players[player_id]).attr("class", "player-number")
    player_identity_data = player_identity.append("div").attr("class", "player-identity-data")
    
    player_identity_data.append("h2").text(player_name)
    player_identity_data.append("span")
        .append("h5").text(player_position)
        .text(player_position)
    
    player_identity_data.select("span").append("img").attr("src", ctx.data["nationalities_flag"][player_nationality]).attr("class", "flag")
    player_identity_data.append("span").text(`Rating: ${get_player_score(player_id, player_position)}`)
    
    // happen club logo
    head_card.append("img").attr("src", ctx.data["clubs_logo"][player_club])
        .attr("class", "club-logo")
        .append("title").text(player_club)

    // add the categories
    Object.keys(ctx.data["player_card_stats"]).forEach(category => {
        category_wrapper = player_card.append("div").attr("class", "category")
        category_wrapper.append("h5").text(category)

        indicators = ctx.data["player_card_stats"][category]

        Object.keys(indicators).forEach(indicator => {
            indicator_wrapper = category_wrapper.append("div").attr("class", "sub-category")
            indicator_wrapper.append("h6").text(indicator)
            total_value = VALUES_CARD_STATS[player_id][indicator]
            
            closest_seuil = Object.keys(seuils).reduce((a, b) => Math.abs(b - total_value) < Math.abs(a - total_value) ? b : a)
            closest_seuil = seuils[closest_seuil]

            indicator_wrapper.append("progress")
                .attr("value", total_value)
                .attr("max", 1)
                .attr("seuil", closest_seuil)
                // on hover, display chart distribution
            
            indicator_wrapper
                .on("mouseover", function(event) {
                    distribution_chart = d3.select(`.distribution-charts #${get_indicator_id(indicator)}`)
                    distribution_chart.classed("show", true)
                    
                    // position on top of the progress bar
                    progress_bar_x = event.target.getBoundingClientRect().x
                    progress_bar_y = event.target.getBoundingClientRect().y
                    distribution_chart.style("top", `${progress_bar_y - 15 - ctx.distribution_chart_height}px`)
                    distribution_chart.style("left", `${progress_bar_x - 50}px`)

                    // color the bar where total_value is the closest
                    value = d3.select(this).select("progress").attr("value")
                    value_on_tick = Math.round(value / 0.05) * 0.05
                    // add a line to the distribution chart
                    distribution_chart.select("g").selectAll("line").remove()
                    distribution_chart.select("g").append("line")
                        .attr("x1", ctx.X_DISTRIBUTION_SCALE(value_on_tick + 0.025))
                        .attr("x2", ctx.X_DISTRIBUTION_SCALE(value_on_tick + 0.025))
                        .attr("y1", ctx.distribution_chart_height - 40)
                        .attr("y2", 0)
                        .style("stroke", "#d00434")
                        .style("stroke-width", 2)

                    distribution_chart.selectAll("rect").style("fill", "#668cd0")
                    distribution_chart.selectAll("rect").filter(function(d) {
                        return d == value_on_tick
                    }
                    ).style("fill", "#71d35b")
                })
                .on("mouseout", function() {
                    distribution_chart = d3.select(`.distribution-charts #${get_indicator_id(indicator)}`)
                    distribution_chart.classed("show", false)
                })
        })
    })
    console.log(ctx.data);
    const player_name123 = "Nuno Mendes";
    const imageUrl = getPlayerImageUrl(player_name123);
    console.log(imageUrl); // Outputs the image URL or null if not found
}

function get_indicator_id(indicator) {
    return indicator.replaceAll(" ", "-").toLowerCase()
}

function draw_distribution_chart(indicator) {
    wrapper = d3.select(".distribution-charts")
    chart = wrapper.append("div").attr("class", "distribution-chart")
    chart.attr("id", get_indicator_id(indicator))
    chart.append("h5").text(indicator)

    // create the canvas
    svg = chart.append("svg")
        .attr("width", ctx.distribution_chart_width)
        .attr("height", ctx.distribution_chart_height)
        .append("g")
        .attr("transform", "translate(50, 15)")

    // get the data
    data = []
    Object.keys(VALUES_CARD_STATS).forEach(player_id => {
        data.push(VALUES_CARD_STATS[player_id][indicator])
    })


    // data = [v1, v2, v2, v3, ...] -> [v1: 1, v2: 2, v3: 1, ...]
    // regroup data per tic of 0.05
    tick = 0.05
    data_by_tick = {}
    data.forEach(value => {
        tick_value = Math.round(value / tick) * tick
        if (data_by_tick[tick_value] == undefined) {
            data_by_tick[tick_value] = 1
        } else {
            data_by_tick[tick_value] += 1
        }
    })

    // sort
    data_by_tick = Object.keys(data_by_tick).sort().reduce((acc, key) => {
        acc[key] = data_by_tick[key]
        return acc
    }, {})

    // create the x scale
    x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, ctx.distribution_chart_width - 100])

    ctx.X_DISTRIBUTION_SCALE = x

    // create the y scale
    y = d3.scaleLinear()
        .domain([0, d3.max(Object.values(data_by_tick))])
        .range([ctx.distribution_chart_height - 40, 0])

    // create the x axis
    svg.append("g")
        .attr("transform", "translate(0, " + (ctx.distribution_chart_height - 40) + ")")
        .call(d3.axisBottom(x))

    // // create the y axis
    // svg.append("g")
    //     .call(d3.axisLeft(y))

    // create the bars
    svg.selectAll("rect")
        .data(Object.keys(data_by_tick))
        .enter()
        .append("rect")
        .attr("x", d => x(d))
        .attr("y", d => y(data_by_tick[d]))
        .attr("width", 10)
        .attr("height", d => ctx.distribution_chart_height - 40 - y(data_by_tick[d]))
        .style("fill", "steelblue")
}

function get_player_score(player_id, position) {
    // score = 
    const scorification = {
        "Goalkeeper": {
            "Saves": 0.50,
            "Reflexes": 0.30,
            "Sweeping": 0.15,
        },
        "Defender": {
            "Tackles": 0.20,
            "Interceptions": 0.20,
            "Marking": 0.25,
            "Jumping": 0.08,
            "Balance": 0.13,
        },
        "Midfielder": {
            "Ball Control": 0.20,
            "Playmaking": 0.25,
            "Acceleration and Speed": 0.10,
            "Balance": 0.10,
            "Stamina": 0.10,
            "Interception": 0.10,
            "Tackles": 0.10,
            "Jumping": 0.06
        },
        "Forward": {
            "Finishing": 0.40,
            "Dribbling": 0.20,
            "Acceleration and Speed": 0.15,
            "Crosses": 0.10,
            "Heading": 0.08,
            "Agility": 0.12,
            "Ball Control": 0.05
        }
    }

    // all other indicators are use to do a bonus/malus indicator with a 0.1 weight
    other_indicators = []

    // get the player data
    player = VALUES_CARD_STATS[player_id]
    score = 0
    Object.keys(player).forEach(indicator => {
        if (scorification[position] != undefined && scorification[position][indicator] != undefined) {
            score += scorification[position][indicator] * player[indicator]
        } else {
            // except goalkeeper indicators
            if (ctx.data["player_card_stats"]["Goalkeeper"][indicator] != undefined) {}
            
            // if player is goal keeper we don't take into account attack and defense indicators
            
            else other_indicators.push(player[indicator])
        }
    })

    // bonus/malus avg
    other_indicators = other_indicators.reduce((acc, cur) => acc + cur, 0) / other_indicators.length

    return Math.min(Math.max(parseInt((score + other_indicators * 0.27) * 100), 0), 100)
}

function getPlayerImageUrl(player_name) {
    if (!ctx.data["soccer_wiki"]) {
        console.error("soccer_wiki data is not loaded");
        return null;
    }

    const playerData = ctx.data["soccer_wiki"].PlayerData;
    const [forename, surname] = player_name.toLowerCase().split(" ");

    const player = playerData.find(
        p => p.Forename.toLowerCase() === forename && p.Surname.toLowerCase() === surname
    );

    return player ? player.ImageURL : https://upload.wikimedia.org/wikipedia/commons/d/d4/Missing_photo.svg;
}

