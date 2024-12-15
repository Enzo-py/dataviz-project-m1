cols_categories = {
    "full_name": ["PLAYER_INFORMATION"],
    "age": ["PLAYER_INFORMATION"],
    "birthday": ["PLAYER_INFORMATION"],
    "birthday_GMT": ["PLAYER_INFORMATION"],
    "league": ["COMPETITION"],
    "season": ["SEASON"],
    "position": ["PLAYER_INFORMATION", "POSITION"],
    "Current Club": ["PLAYER_INFORMATION", "TEAM_INFORMATION"],
    "minutes_played_overall": ["PLAYING_TIME", "STATS"],
    "minutes_played_home": ["PLAYING_TIME", "STATS"],
    "minutes_played_away": ["PLAYING_TIME", "STATS"],
    "nationality": ["PLAYER_INFORMATION"],
    "appearances_overall": ["STATS"],
    "appearances_home": ["STATS"],
    "appearances_away": ["STATS"],
    "goals_overall": ["SCORING", "STATS"],
    "goals_home": ["SCORING", "STATS"],
    "goals_away": ["SCORING", "STATS"],
    "assists_overall": ["ASSISTS", "STATS"],
    "assists_home": ["ASSISTS", "STATS"],
    "assists_away": ["ASSISTS", "STATS"],
    "penalty_goals": ["SCORING", "STATS"],
    "penalty_misses": ["STATS"],
    "clean_sheets_overall": ["DEFENDING", "STATS"],
    "clean_sheets_home": ["DEFENDING", "STATS"],
    "clean_sheets_away": ["DEFENDING", "STATS"],
    "conceded_overall": ["DEFENDING", "STATS"],
    "conceded_home": ["DEFENDING", "STATS"],
    "conceded_away": ["DEFENDING", "STATS"],
    "yellow_cards_overall": ["DISCIPLINE", "STATS"],
    "red_cards_overall": ["DISCIPLINE", "STATS"],
    "goals_involved_per_90_overall": ["SCORING", "EFFICIENCY"],
    "assists_per_90_overall": ["ASSISTS", "EFFICIENCY"],
    "goals_per_90_overall": ["SCORING", "EFFICIENCY"],
    "goals_per_90_home": ["SCORING", "EFFICIENCY"],
    "goals_per_90_away": ["SCORING", "EFFICIENCY"],
    "min_per_goal_overall": ["SCORING", "EFFICIENCY"],
    "conceded_per_90_overall": ["DEFENDING", "EFFICIENCY"],
    "min_per_conceded_overall": ["DEFENDING", "EFFICIENCY"],
    "min_per_match": ["PLAYING_TIME"],
    "min_per_card_overall": ["DISCIPLINE", "EFFICIENCY"],
    "min_per_assist_overall": ["ASSISTS", "EFFICIENCY"],
    "cards_per_90_overall": ["DISCIPLINE", "EFFICIENCY"],
    "rank_in_league_top_attackers": ["RANKING"],
    "rank_in_league_top_midfielders": ["RANKING"],
    "rank_in_league_top_defenders": ["RANKING"],
    "rank_in_club_top_scorer": ["RANKING"],
    "average_rating_overall": ["PLAYER_RATING"],
    "assists_per_game_overall": ["ASSISTS", "EFFICIENCY"],
    "sm_assists_total_overall": ["ASSISTS"],
    "assists_per90_percentile_overall": ["ASSISTS", "EFFICIENCY"],
    "passes_per_90_overall": ["PASSING", "EFFICIENCY"],
    "passes_per_game_overall": ["PASSING", "EFFICIENCY"],
    "passes_per90_percentile_overall": ["PASSING", "EFFICIENCY"],
    "passes_total_overall": ["PASSING"],
    "passes_completed_per_game_overall": ["PASSING", "EFFICIENCY"],
    "passes_completed_total_overall": ["PASSING"],
    "pass_completion_rate_percentile_overall": ["PASSING", "EFFICIENCY"],
    "passes_completed_per_90_overall": ["PASSING", "EFFICIENCY"],
    "passes_completed_per90_percentile_overall": ["PASSING", "EFFICIENCY"],
    "short_passes_per_game_overall": ["PASSING"],
    "long_passes_per_game_overall": ["PASSING"],
    "key_passes_per_game_overall": ["PASSING", "STATS"],
    "key_passes_total_overall": ["PASSING", "STATS"],
    "through_passes_per_game_overall": ["PASSING"],
    "crosses_per_game_overall": ["PASSING", "STATS"],
    "tackles_per_90_overall": ["DEFENDING", "EFFICIENCY"],
    "tackles_per_game_overall": ["DEFENDING", "STATS"],
    "tackles_total_overall": ["DEFENDING"],
    "tackles_successful_per_game_overall": ["DEFENDING", "EFFICIENCY"],
    "dispossesed_per_game_overall": ["DEFENDING", "STATS"],
    "possession_regained_per_game_overall": ["DEFENDING", "STATS"],
    "pressures_per_game_overall": ["DEFENDING", "STATS"],
    "saves_per_game_overall": ["GOALKEEPER", "STATS"],
    "interceptions_per_game_overall": ["DEFENDING", "STATS"],
    "dribbles_successful_per_game_overall": ["ATTACKING", "EFFICIENCY"],
    "shots_faced_per_game_overall": ["GOALKEEPER", "STATS"],
    "shots_per_goal_scored_overall": ["SCORING", "EFFICIENCY"],
    "shots_per_90_overall": ["SCORING", "EFFICIENCY"],
    "shots_off_target_per_game_overall": ["SCORING", "EFFICIENCY"],
    "dribbles_per_game_overall": ["ATTACKING", "STATS"],
    "distance_travelled_per_game_overall": ["PHYSICAL_STATS"],
    "shots_on_target_per_game_overall": ["SCORING", "EFFICIENCY"],
    "xg_per_game_overall": ["SCORING", "STATS"],
    "chances_created_per_game_overall": ["ATTACKING", "STATS"],
    "aerial_duels_won_per_game_overall": ["DEFENDING", "STATS"],
    "aerial_duels_per_game_overall": ["DEFENDING", "STATS"],
    "possession_regained_per_90_overall": ["DEFENDING", "EFFICIENCY"],
    "possession_regained_total_overall": ["DEFENDING", "STATS"],
    "possession_regained_per90_percentile_overall": ["DEFENDING", "EFFICIENCY"],
    "additional_info": ["PLAYER_INFORMATION"],
    "shots_total_overall": ["SCORING"],
    "shots_per_game_overall": ["SCORING"],
    "shots_per90_percentile_overall": ["SCORING", "EFFICIENCY"],
    "shots_on_target_total_overall": ["SCORING"],
    "shots_on_target_per_90_overall": ["SCORING", "EFFICIENCY"],
    "shots_on_target_per90_percentile_overall": ["SCORING", "EFFICIENCY"],
    "shots_off_target_total_overall": ["SCORING"],
    "shots_off_target_per_90_overall": ["SCORING", "EFFICIENCY"],
    "shots_off_target_per90_percentile_overall": ["SCORING", "EFFICIENCY"],
    "games_subbed_out": ["PLAYER_INFORMATION", "PLAYING_TIME"],
    "games_subbed_in": ["PLAYER_INFORMATION", "PLAYING_TIME"],
    "games_started": ["PLAYER_INFORMATION", "PLAYING_TIME"],
    "tackles_per90_percentile_overall": ["DEFENDING", "EFFICIENCY"],
    "tackles_successful_per_90_overall": ["DEFENDING", "EFFICIENCY"],
    "tackles_successful_per90_percentile_overall": ["DEFENDING", "EFFICIENCY"],
    "tackles_successful_total_overall": ["DEFENDING"],
    "interceptions_total_overall": ["DEFENDING"],
    "interceptions_per_90_overall": ["DEFENDING", "EFFICIENCY"],
    "interceptions_per90_percentile_overall": ["DEFENDING", "EFFICIENCY"],
    "crosses_total_overall": ["PASSING"],
    "cross_completion_rate_percentile_overall": ["PASSING", "EFFICIENCY"],
    "crosses_per_90_overall": ["PASSING"],
    "crosses_per90_percentile_overall": ["PASSING", "EFFICIENCY"],
    "through_passes_total_overall": ["PASSING"],
    "through_passes_per_90_overall": ["PASSING"],
    "through_passes_per90_percentile_overall": ["PASSING", "EFFICIENCY"],
    "long_passes_total_overall": ["PASSING"],
    "long_passes_per_90_overall": ["PASSING"],
    "long_passes_per90_percentile_overall": ["PASSING", "EFFICIENCY"],
    "short_passes_total_overall": ["PASSING"],
    "short_passes_per_90_overall": ["PASSING"],
    "short_passes_per90_percentile_overall": ["PASSING", "EFFICIENCY"],
    "key_passes_per_90_overall": ["PASSING"],
    "key_passes_per90_percentile_overall": ["PASSING", "EFFICIENCY"],
    "dribbles_total_overall": ["ATTACKING"],
    "dribbles_per_90_overall": ["ATTACKING", "EFFICIENCY"],
    "dribbles_per90_percentile_overall": ["ATTACKING", "EFFICIENCY"],
    "dribbles_successful_total_overall": ["ATTACKING"],
    "dribbles_successful_per_90_overall": ["ATTACKING", "EFFICIENCY"],
    "dribbles_successful_percentage_overall": ["ATTACKING", "EFFICIENCY"],
    "chances_created_total_overall": ["ATTACKING"],
    "chances_created_per_90_overall": ["ATTACKING", "EFFICIENCY"],
    "chances_created_per90_percentile_overall": ["ATTACKING", "EFFICIENCY"],
    "saves_total_overall": ["GOALKEEPER"],
    "save_percentage_percentile_overall": ["GOALKEEPER", "EFFICIENCY"],
    "saves_per_90_overall": ["GOALKEEPER", "EFFICIENCY"],
    "saves_per90_percentile_overall": ["GOALKEEPER", "EFFICIENCY"],
    "shots_faced_total_overall": ["GOALKEEPER"],
    "shots_per_goal_conceded_overall": ["GOALKEEPER", "EFFICIENCY"],
    "sm_goals_conceded_total_overall": ["GOALKEEPER"],
    "conceded_per90_percentile_overall": ["DEFENDING", "EFFICIENCY"],
    "shots_faced_per_90_overall": ["GOALKEEPER", "EFFICIENCY"],
    "shots_faced_per90_percentile_overall": ["GOALKEEPER", "EFFICIENCY"],
    "xg_faced_per_90_overall": ["GOALKEEPER", "EFFICIENCY"],
    "xg_faced_per90_percentile_overall": ["GOALKEEPER", "EFFICIENCY"],
    "xg_faced_per_game_overall": ["GOALKEEPER"],
    "xg_faced_total_overall": ["GOALKEEPER"],
    "save_percentage_overall": ["GOALKEEPER", "EFFICIENCY"],
    "pressures_total_overall": ["DEFENDING"],
    "pressures_per_90_overall": ["DEFENDING", "EFFICIENCY"],
    "pressures_per90_percentile_overall": ["DEFENDING", "EFFICIENCY"],
    "xg_total_overall": ["SCORING"],
    "market_value": ["PLAYER_INFORMATION"],
    "market_value_percentile": ["PLAYER_INFORMATION"],
    "pass_completion_rate_overall": ["PASSING", "EFFICIENCY"],
    "shot_accuraccy_percentage_overall": ["SCORING", "EFFICIENCY"],
    "shot_accuraccy_percentage_percentile_overall": ["SCORING", "EFFICIENCY"],
    "sm_goals_scored_total_overall": ["SCORING"],
    "dribbled_past_per90_percentile_overall": ["DEFENDING", "EFFICIENCY"],
    "clearances_per_90_overall": ["DEFENDING"],
    "clearances_total_overall": ["DEFENDING"],
    "dribbled_past_per_game_overall": ["ATTACKING", "POSSESION_BALL_CONTROL"],
    "dribbled_past_per_90_overall": ["ATTACKING", "POSSESION_BALL_CONTROL"],
    "dribbled_past_total_overall": ["ATTACKING", "POSSESION_BALL_CONTROL"],
    "dribbles_successful_per90_percentile_overall": ["ATTACKING", "POSSESION_BALL_CONTROL"],
    "dribbles_successful_percentage_percentile_overall": ["ATTACKING", "POSSESION_BALL_CONTROL"],
    "pen_scored_total_overall": ["SCORING", "EFFICIENCY"],
    "pen_missed_total_overall": ["SCORING", "EFFICIENCY"],
    "inside_box_saves_total_overall": ["GOALKEEPER", "DEFENDING"],
    "blocks_per_game_overall": ["DEFENDING", "EFFICIENCY"],
    "blocks_per_90_overall": ["DEFENDING", "EFFICIENCY"],
    "blocks_total_overall": ["DEFENDING", "EFFICIENCY"],
    "blocks_per90_percentile_overall": ["DEFENDING", "EFFICIENCY"],
    "ratings_total_overall": ["PLAYER_RATING"],
    "clearances_per_game_overall": ["DEFENDING", "EFFICIENCY"],
    "pen_committed_total_overall": ["DISCIPLINE", "DEFENDING"],
    "pen_save_percentage_overall": ["GOALKEEPER", "EFFICIENCY"],
    "pen_committed_per_90_overall": ["DISCIPLINE", "DEFENDING"],
    "pen_committed_per90_percentile_overall": ["DISCIPLINE", "DEFENDING"],
    "pen_committed_per_game_overall": ["DISCIPLINE", "DEFENDING"],
    "pens_saved_total_overall": ["GOALKEEPER", "EFFICIENCY"],
    "pens_taken_total_overall": ["SCORING", "EFFICIENCY"],
    "hit_woodwork_total_overall": ["SCORING", "EFFICIENCY"],
    "hit_woodwork_per_game_overall": ["SCORING", "EFFICIENCY"],
    "hit_woodwork_per_90_overall": ["SCORING", "EFFICIENCY"],
    "punches_total_overall": ["GOALKEEPER", "DEFENDING"],
    "punches_per_game_overall": ["GOALKEEPER", "DEFENDING"],
    "punches_per_90_overall": ["GOALKEEPER", "DEFENDING"],
    "offsides_per_90_overall": ["ATTACKING", "DISCIPLINE"],
    "offsides_per_game_overall": ["ATTACKING", "DISCIPLINE"],
    "offsides_total_overall": ["ATTACKING", "DISCIPLINE"],
    "penalties_won_total_overall": ["SCORING", "EFFICIENCY"],
    "shot_conversion_rate_overall": ["SCORING", "EFFICIENCY"],
    "shot_conversion_rate_percentile_overall": ["SCORING", "EFFICIENCY"],
    "sm_minutes_played_per90_percentile_overall": ["PLAYING_TIME"],
    "sm_minutes_played_recorded_overall": ["PLAYING_TIME"],
    "minutes_played_percentile_overall": ["PLAYING_TIME"],
    "matches_played_percentile_overall": ["PLAYING_TIME"],
    "min_per_goal_percentile_overall": ["SCORING", "EFFICIENCY"],
    "min_per_conceded_percentile_overall": ["GOALKEEPER", "EFFICIENCY"],
    "xa_total_overall": ["ASSISTS", "PASSING"],
    "xa_per90_percentile_overall": ["ASSISTS", "PASSING"],
    "xa_per_game_overall": ["ASSISTS", "PASSING"],
    "xa_per_90_overall": ["ASSISTS", "PASSING"],
    "npxg_total_overall": ["SCORING", "EFFICIENCY"],
    "npxg_per90_percentile_overall": ["SCORING", "EFFICIENCY"],
    "npxg_per_game_overall": ["SCORING", "EFFICIENCY"],
    "npxg_per_90_overall": ["SCORING", "EFFICIENCY"],
    "fouls_drawn_per90_percentile_overall": ["DISCIPLINE"],
    "fouls_drawn_total_overall": ["DISCIPLINE"],
    "fouls_drawn_per_game_overall": ["DISCIPLINE"],
    "fouls_drawn_per_90_overall": ["DISCIPLINE"],
    "fouls_committed_per_90_overall": ["DISCIPLINE"],
    "fouls_committed_per_game_overall": ["DISCIPLINE"],
    "fouls_committed_per90_percentile_overall": ["DISCIPLINE"],
    "fouls_committed_total_overall": ["DISCIPLINE"],
    "xg_per_90_overall": ["SCORING", "EFFICIENCY"],
    "xg_per90_percentile_overall": ["SCORING", "EFFICIENCY"],
    "average_rating_percentile_overall": ["PLAYER_RATING"],
    "clearances_per90_percentile_overall": ["DEFENDING", "EFFICIENCY"],
    "hit_woodwork_per90_percentile_overall": ["SCORING", "EFFICIENCY"],
    "punches_per90_percentile_overall": ["GOALKEEPER", "DEFENDING"],
    "offsides_per90_percentile_overall": ["ATTACKING", "DISCIPLINE"],
    "aerial_duels_won_per90_percentile_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "aerial_duels_total_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "aerial_duels_per_90_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "aerial_duels_per90_percentile_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "aerial_duels_won_total_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "aerial_duels_won_percentage_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "aerial_duels_won_per_90_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "duels_per_90_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "duels_per_game_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "duels_total_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "duels_won_total_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "duels_won_per90_percentile_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "duels_per90_percentile_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "duels_won_per_90_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "duels_won_per_game_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "duels_won_percentage_overall": ["PHYSICAL_STATS", "EFFICIENCY"],
    "dispossesed_total_overall": ["DEFENDING", "EFFICIENCY"],
    "dispossesed_per_90_overall": ["DEFENDING", "EFFICIENCY"],
    "dispossesed_per90_percentile_overall": ["DEFENDING", "EFFICIENCY"],
    "progressive_passes_total_overall": ["PASSING", "EFFICIENCY"],
    "cross_completion_rate_overall": ["PASSING", "EFFICIENCY"],
    "distance_travelled_total_overall": ["PHYSICAL_STATS"],
    "distance_travelled_per_90_overall": ["PHYSICAL_STATS"],
    "distance_travelled_per90_percentile_overall": ["PHYSICAL_STATS"],
    "accurate_crosses_total_overall": ["PASSING", "EFFICIENCY"],
    "accurate_crosses_per_game_overall": ["PASSING", "EFFICIENCY"],
    "accurate_crosses_per_90_overall": ["PASSING", "EFFICIENCY"],
    "accurate_crosses_per90_percentile_overall": ["PASSING", "EFFICIENCY"],
    "sm_matches_recorded_total_overall": ["SEASON"],
    "games_started_percentile_overall": ["PLAYING_TIME"],
    "games_subbed_in_percentile_overall": ["PLAYING_TIME"],
    "games_subbed_out_percentile_overall": ["PLAYING_TIME"],
    "hattricks_total_overall": ["SCORING", "EFFICIENCY"],
    "two_goals_in_a_game_total_overall": ["SCORING", "EFFICIENCY"],
    "three_goals_in_a_game_total_overall": ["SCORING", "EFFICIENCY"],
    "two_goals_in_a_game_percentage_overall": ["SCORING", "EFFICIENCY"],
    "three_goals_in_a_game_percentage_overall": ["SCORING", "EFFICIENCY"],
    "goals_involved_per90_percentile_overall": ["SCORING", "ASSISTS"],
    "goals_per90_percentile_overall": ["SCORING", "EFFICIENCY"],
    "goals_per90_percentile_away": ["SCORING", "EFFICIENCY"],
    "goals_per90_percentile_home": ["SCORING", "EFFICIENCY"],
    "man_of_the_match_total_overall": ["STATS", "EFFICIENCY"],
    "annual_salary_eur": ["PLAYER_INFORMATION"],
    "annual_salary_eur_percentile": ["PLAYER_INFORMATION"],
    "clean_sheets_percentage_percentile_overall": ["GOALKEEPER", "EFFICIENCY"],
    "min_per_card_percentile_overall": ["DISCIPLINE"],
    "cards_per90_percentile_overall": ["DISCIPLINE"],
    "booked_over05_overall": ["DISCIPLINE"],
    "booked_over05_percentage_overall": ["DISCIPLINE"],
    "booked_over05_percentage_percentile_overall": ["DISCIPLINE"],
    "shirt_number": ["PLAYER_INFORMATION"],
    "annual_salary_gbp": ["PLAYER_INFORMATION"],
    "annual_salary_usd": ["PLAYER_INFORMATION"]
}


cols = "full_name,age,birthday,birthday_GMT,league,season,position,Current Club,minutes_played_overall,minutes_played_home,minutes_played_away,nationality,appearances_overall,appearances_home,appearances_away,goals_overall,goals_home,goals_away,assists_overall,assists_home,assists_away,penalty_goals,penalty_misses,clean_sheets_overall,clean_sheets_home,clean_sheets_away,conceded_overall,conceded_home,conceded_away,yellow_cards_overall,red_cards_overall,goals_involved_per_90_overall,assists_per_90_overall,goals_per_90_overall,goals_per_90_home,goals_per_90_away,min_per_goal_overall,conceded_per_90_overall,min_per_conceded_overall,min_per_match,min_per_card_overall,min_per_assist_overall,cards_per_90_overall,rank_in_league_top_attackers,rank_in_league_top_midfielders,rank_in_league_top_defenders,rank_in_club_top_scorer,average_rating_overall,assists_per_game_overall,sm_assists_total_overall,assists_per90_percentile_overall,passes_per_90_overall,passes_per_game_overall,passes_per90_percentile_overall,passes_total_overall,passes_completed_per_game_overall,passes_completed_total_overall,pass_completion_rate_percentile_overall,passes_completed_per_90_overall,passes_completed_per90_percentile_overall,short_passes_per_game_overall,long_passes_per_game_overall,key_passes_per_game_overall,key_passes_total_overall,through_passes_per_game_overall,crosses_per_game_overall,tackles_per_90_overall,tackles_per_game_overall,tackles_total_overall,tackles_successful_per_game_overall,dispossesed_per_game_overall,possession_regained_per_game_overall,pressures_per_game_overall,saves_per_game_overall,interceptions_per_game_overall,dribbles_successful_per_game_overall,shots_faced_per_game_overall,shots_per_goal_scored_overall,shots_per_90_overall,shots_off_target_per_game_overall,dribbles_per_game_overall,distance_travelled_per_game_overall,shots_on_target_per_game_overall,xg_per_game_overall,chances_created_per_game_overall,aerial_duels_won_per_game_overall,aerial_duels_per_game_overall,possession_regained_per_90_overall,possession_regained_total_overall,possession_regained_per90_percentile_overall,additional_info,shots_total_overall,shots_per_game_overall,shots_per90_percentile_overall,shots_on_target_total_overall,shots_on_target_per_90_overall,shots_on_target_per90_percentile_overall,shots_off_target_total_overall,shots_off_target_per_90_overall,shots_off_target_per90_percentile_overall,games_subbed_out,games_subbed_in,games_started,tackles_per90_percentile_overall,tackles_successful_per_90_overall,tackles_successful_per90_percentile_overall,tackles_successful_total_overall,interceptions_total_overall,interceptions_per_90_overall,interceptions_per90_percentile_overall,crosses_total_overall,cross_completion_rate_percentile_overall,crosses_per_90_overall,crosses_per90_percentile_overall,through_passes_total_overall,through_passes_per_90_overall,through_passes_per90_percentile_overall,long_passes_total_overall,long_passes_per_90_overall,long_passes_per90_percentile_overall,short_passes_total_overall,short_passes_per_90_overall,short_passes_per90_percentile_overall,key_passes_per_90_overall,key_passes_per90_percentile_overall,dribbles_total_overall,dribbles_per_90_overall,dribbles_per90_percentile_overall,dribbles_successful_total_overall,dribbles_successful_per_90_overall,dribbles_successful_percentage_overall,chances_created_total_overall,chances_created_per_90_overall,chances_created_per90_percentile_overall,saves_total_overall,save_percentage_percentile_overall,saves_per_90_overall,saves_per90_percentile_overall,shots_faced_total_overall,shots_per_goal_conceded_overall,sm_goals_conceded_total_overall,conceded_per90_percentile_overall,shots_faced_per_90_overall,shots_faced_per90_percentile_overall,xg_faced_per_90_overall,xg_faced_per90_percentile_overall,xg_faced_per_game_overall,xg_faced_total_overall,save_percentage_overall,pressures_total_overall,pressures_per_90_overall,pressures_per90_percentile_overall,xg_total_overall,market_value,market_value_percentile,pass_completion_rate_overall,shot_accuraccy_percentage_overall,shot_accuraccy_percentage_percentile_overall,sm_goals_scored_total_overall,dribbled_past_per90_percentile_overall,dribbled_past_per_game_overall,dribbled_past_per_90_overall,dribbled_past_total_overall,dribbles_successful_per90_percentile_overall,dribbles_successful_percentage_percentile_overall,pen_scored_total_overall,pen_missed_total_overall,inside_box_saves_total_overall,blocks_per_game_overall,blocks_per_90_overall,blocks_total_overall,blocks_per90_percentile_overall,ratings_total_overall,clearances_per_game_overall,clearances_per_90_overall,clearances_total_overall,pen_committed_total_overall,pen_save_percentage_overall,pen_committed_per_90_overall,pen_committed_per90_percentile_overall,pen_committed_per_game_overall,pens_saved_total_overall,pens_taken_total_overall,hit_woodwork_total_overall,hit_woodwork_per_game_overall,hit_woodwork_per_90_overall,punches_total_overall,punches_per_game_overall,punches_per_90_overall,offsides_per_90_overall,offsides_per_game_overall,offsides_total_overall,penalties_won_total_overall,shot_conversion_rate_overall,shot_conversion_rate_percentile_overall,sm_minutes_played_per90_percentile_overall,sm_minutes_played_recorded_overall,minutes_played_percentile_overall,matches_played_percentile_overall,min_per_goal_percentile_overall,min_per_conceded_percentile_overall,xa_total_overall,xa_per90_percentile_overall,xa_per_game_overall,xa_per_90_overall,npxg_total_overall,npxg_per90_percentile_overall,npxg_per_game_overall,npxg_per_90_overall,fouls_drawn_per90_percentile_overall,fouls_drawn_total_overall,fouls_drawn_per_game_overall,fouls_drawn_per_90_overall,fouls_committed_per_90_overall,fouls_committed_per_game_overall,fouls_committed_per90_percentile_overall,fouls_committed_total_overall,xg_per_90_overall,xg_per90_percentile_overall,average_rating_percentile_overall,clearances_per90_percentile_overall,hit_woodwork_per90_percentile_overall,punches_per90_percentile_overall,offsides_per90_percentile_overall,aerial_duels_won_per90_percentile_overall,aerial_duels_total_overall,aerial_duels_per_90_overall,aerial_duels_per90_percentile_overall,aerial_duels_won_total_overall,aerial_duels_won_percentage_overall,aerial_duels_won_per_90_overall,duels_per_90_overall,duels_per_game_overall,duels_total_overall,duels_won_total_overall,duels_won_per90_percentile_overall,duels_per90_percentile_overall,duels_won_per_90_overall,duels_won_per_game_overall,duels_won_percentage_overall,dispossesed_total_overall,dispossesed_per_90_overall,dispossesed_per90_percentile_overall,progressive_passes_total_overall,cross_completion_rate_overall,distance_travelled_total_overall,distance_travelled_per_90_overall,distance_travelled_per90_percentile_overall,accurate_crosses_total_overall,accurate_crosses_per_game_overall,accurate_crosses_per_90_overall,accurate_crosses_per90_percentile_overall,sm_matches_recorded_total_overall,games_started_percentile_overall,games_subbed_in_percentile_overall,games_subbed_out_percentile_overall,hattricks_total_overall,two_goals_in_a_game_total_overall,three_goals_in_a_game_total_overall,two_goals_in_a_game_percentage_overall,three_goals_in_a_game_percentage_overall,goals_involved_per90_percentile_overall,goals_per90_percentile_overall,goals_per90_percentile_away,goals_per90_percentile_home,man_of_the_match_total_overall,annual_salary_eur,annual_salary_eur_percentile,clean_sheets_percentage_percentile_overall,min_per_card_percentile_overall,cards_per90_percentile_overall,booked_over05_overall,booked_over05_percentage_overall,booked_over05_percentage_percentile_overall,shirt_number,annual_salary_gbp,annual_salary_usd"
cols = cols.split(",")

categories = set()
for col in cols:
    if col in cols_categories:
        categories.update(cols_categories[col])
print(categories)

# # reverse the dictionary
# categories_cols = {}
# for col in cols_categories:
#     for cat in cols_categories[col]:
#         if cat not in categories_cols:
#             categories_cols[cat] = []
#         categories_cols[cat].append(col)

# # format it as a string to be able to add it to the code (js)
# categories_cols_str = "{\n"
# for cat in categories_cols:
#     categories_cols_str += f'"{cat}": {categories_cols[cat]},\n'
# categories_cols_str += "}"
# print(categories_cols_str)

