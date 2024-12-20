// save player_id, indicatori, ..., global_score, radar_categories
    // values ....................................................... into a csv file
    path = "data/players_agg.csv"
    
    let csv_cols = ["player_id", "position_int",]
    Object.keys(ctx.data["player_card_stats"]).forEach(category => {
        indicators = ctx.data["player_card_stats"][category]
        Object.keys(indicators).forEach(indicator => {
            csv_cols.push(indicator)
        })
    })

    csv_cols.push("global_score")

    Object.keys(ctx.data["players_radar_categories"]).forEach(category => {
        csv_cols.push(category)
    })

    csv_cols.push("club")

    let csv_data = []
    Object.keys(ctx.data["players_agg"]).forEach(player_id => {
        player = ctx.data["players_agg"][player_id]
        player_position = player[Object.keys(player)[0]]["position"]
        player_position_int = player_position == "Goalkeeper" ? 0 : player_position == "Defender" ? 1 : player_position == "Midfielder" ? 2 : 3

        player_data = [player_id, player_position_int]
        Object.keys(ctx.data["player_card_stats"]).forEach(category => {
            indicators = ctx.data["player_card_stats"][category]
            Object.keys(indicators).forEach(indicator => {
                player_data.push(VALUES_CARD_STATS[player_id][indicator])
            })
        })

        player_data.push(get_player_score(player_id, player_position))
        
        // push avg values for radar categories
        season_2021_2022 = ctx.data["players_agg"][player_id]["2021-2022"]
        season_2022_2023 = ctx.data["players_agg"][player_id]["2022-2023"]
        season_2023_2024 = ctx.data["players_agg"][player_id]["2023-2024"]
        team = null
        Object.keys(ctx.data["players_radar_categories"]).forEach(category => {
            tot = 0
            nb = 0
            if (season_2021_2022 != undefined) {
                tot += season_2021_2022[category]
                nb += 1
                team = season_2021_2022["Current_Club"]
            }
            if (season_2022_2023 != undefined) {
                tot += season_2022_2023[category]
                nb += 1
                team = season_2022_2023["Current_Club"]
            }
            if (season_2023_2024 != undefined) {
                tot += season_2023_2024[category]
                nb += 1
                team = season_2023_2024["Current_Club"]
            }
            player_data.push(tot / nb)
        })
        player_data.push(team)

        csv_data.push(player_data)
    })

    csv_data = csv_data.map(row => row.map(cell => isNaN(cell) ? cell : cell.toFixed(2)) )
    csv_data.unshift(csv_cols)

    let csv = d3.csvFormatRows(csv_data)
    let blob = new Blob([csv], { type: "text/csv" })
    let url = window.URL.createObjectURL(blob)

    let a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", "players_agg.csv")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)