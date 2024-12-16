ctx = {
    data: {},
    selected_players: {},
    rScale: {},
    color_index: 0,
    distribution_chart_height: 100,
    distribution_chart_width: 300,
}

RADAR_CATEGORIES = ['DEFENDING', 'DISCIPLINE', 'SCORING', 'ASSISTS', 'ATTACKING', 'POSSESION_BALL_CONTROL', 'PHYSICAL_STATS', 'PASSING', 'PLAYING_TIME', 'GOALKEEPER']


const cols_categories = {
    "PLAYER_INFORMATION": ['full_name', 'age', 'birthday', 'birthday_GMT', 'position', 'Current_Club', 'nationality', 'additional_info', 'games_subbed_out', 'games_subbed_in', 'games_started', 'market_value', 'market_value_percentile', 'annual_salary_eur', 'annual_salary_eur_percentile', 'shirt_number', 'annual_salary_gbp', 'annual_salary_usd'],
    "COMPETITION": ['league'],
    "SEASON": ['season', 'sm_matches_recorded_total_overall'],
    "POSITION": ['position'],
    "TEAM_INFORMATION": ['Current_Club'],
    "PLAYING_TIME": ['minutes_played_overall', 'minutes_played_home', 'minutes_played_away', 'min_per_match', 'games_subbed_out', 'games_subbed_in', 'games_started', 'sm_minutes_played_per90_percentile_overall', 'sm_minutes_played_recorded_overall', 'minutes_played_percentile_overall', 'matches_played_percentile_overall', 'games_started_percentile_overall', 'games_subbed_in_percentile_overall', 'games_subbed_out_percentile_overall'],
    "STATS": ['minutes_played_overall', 'minutes_played_home', 'minutes_played_away', 'appearances_overall', 'appearances_home', 'appearances_away', 'goals_overall', 'goals_home', 'goals_away', 'assists_overall', 'assists_home', 'assists_away', 'penalty_goals', 'penalty_misses', 'clean_sheets_overall', 'clean_sheets_home', 'clean_sheets_away', 'conceded_overall', 'conceded_home', 'conceded_away', 'yellow_cards_overall', 'red_cards_overall', 'key_passes_per_game_overall', 'key_passes_total_overall', 'crosses_per_game_overall', 'tackles_per_game_overall', 'dispossesed_per_game_overall', 'possession_regained_per_game_overall', 'pressures_per_game_overall', 'saves_per_game_overall', 'interceptions_per_game_overall', 'shots_faced_per_game_overall', 'dribbles_per_game_overall', 'xg_per_game_overall', 'chances_created_per_game_overall', 'aerial_duels_won_per_game_overall', 'aerial_duels_per_game_overall', 'possession_regained_total_overall', 'man_of_the_match_total_overall'],
    "SCORING": ['goals_overall', 'goals_home', 'goals_away', 'penalty_goals', 'goals_involved_per_90_overall', 'goals_per_90_overall', 'goals_per_90_home', 'goals_per_90_away', 'min_per_goal_overall', 'shots_per_goal_scored_overall', 'shots_per_90_overall', 'shots_off_target_per_game_overall', 'shots_on_target_per_game_overall', 'xg_per_game_overall', 'shots_total_overall', 'shots_per_game_overall', 'shots_per90_percentile_overall', 'shots_on_target_total_overall', 'shots_on_target_per_90_overall', 'shots_on_target_per90_percentile_overall', 'shots_off_target_total_overall', 'shots_off_target_per_90_overall', 'shots_off_target_per90_percentile_overall', 'xg_total_overall', 'shot_accuraccy_percentage_overall', 'shot_accuraccy_percentage_percentile_overall', 'sm_goals_scored_total_overall', 'pen_scored_total_overall', 'pen_missed_total_overall', 'pens_taken_total_overall', 'hit_woodwork_total_overall', 'hit_woodwork_per_game_overall', 'hit_woodwork_per_90_overall', 'penalties_won_total_overall', 'shot_conversion_rate_overall', 'shot_conversion_rate_percentile_overall', 'min_per_goal_percentile_overall', 'npxg_total_overall', 'npxg_per90_percentile_overall', 'npxg_per_game_overall', 'npxg_per_90_overall', 'xg_per_90_overall', 'xg_per90_percentile_overall', 'hit_woodwork_per90_percentile_overall', 'hattricks_total_overall', 'two_goals_in_a_game_total_overall', 'three_goals_in_a_game_total_overall', 'two_goals_in_a_game_percentage_overall', 'three_goals_in_a_game_percentage_overall', 'goals_involved_per90_percentile_overall', 'goals_per90_percentile_overall', 'goals_per90_percentile_away', 'goals_per90_percentile_home'],
    "ASSISTS": ['assists_overall', 'assists_home', 'assists_away', 'assists_per_90_overall', 'min_per_assist_overall', 'assists_per_game_overall', 'sm_assists_total_overall', 'assists_per90_percentile_overall', 'xa_total_overall', 'xa_per90_percentile_overall', 'xa_per_game_overall', 'xa_per_90_overall', 'goals_involved_per90_percentile_overall'],
    "DEFENDING": ["is_defender", "rank_in_league_top_defenders", "rank_in_league_top_defenders", "duels_per_game_overall",'clean_sheets_overall', 'conceded_overall', 'tackles_per_90_overall', 'tackles_per_game_overall', 'tackles_per_game_overall', 'tackles_total_overall', 'tackles_successful_per_game_overall', 'dispossesed_per_game_overall', 'possession_regained_per_game_overall', 'pressures_per_game_overall', 'interceptions_per_game_overall', 'interceptions_per_game_overall', 'aerial_duels_won_per_game_overall', 'aerial_duels_per_game_overall', 'possession_regained_per_90_overall', 'possession_regained_total_overall', 'possession_regained_per90_percentile_overall', 'tackles_per90_percentile_overall', 'tackles_successful_per_90_overall', 'tackles_successful_per90_percentile_overall', 'tackles_successful_total_overall', 'interceptions_total_overall', 'interceptions_per_90_overall', 'interceptions_per90_percentile_overall', 'conceded_per90_percentile_overall', 'pressures_total_overall', 'pressures_per_90_overall', 'pressures_per90_percentile_overall', 'dribbled_past_per90_percentile_overall', 'clearances_per_90_overall', 'clearances_total_overall', 'inside_box_saves_total_overall', 'blocks_per_game_overall', 'blocks_per_90_overall', 'blocks_total_overall', 'blocks_per90_percentile_overall', 'clearances_per_game_overall', 'pen_committed_total_overall', 'pen_committed_per_90_overall', 'pen_committed_per90_percentile_overall', 'pen_committed_per_game_overall', 'punches_total_overall', 'punches_per_game_overall', 'punches_per_90_overall', 'clearances_per90_percentile_overall', 'punches_per90_percentile_overall', 'dispossesed_total_overall', 'dispossesed_per_90_overall', 'dispossesed_per90_percentile_overall'],
    "DISCIPLINE": ['yellow_cards_overall', 'red_cards_overall', 'min_per_card_overall', 'cards_per_90_overall', 'pen_committed_total_overall', 'pen_committed_per_90_overall', 'pen_committed_per90_percentile_overall', 'pen_committed_per_game_overall', 'offsides_per_90_overall', 'offsides_per_game_overall', 'offsides_total_overall', 'fouls_drawn_per90_percentile_overall', 'fouls_drawn_total_overall', 'fouls_drawn_per_game_overall', 'fouls_drawn_per_90_overall', 'fouls_committed_per_90_overall', 'fouls_committed_per_game_overall', 'fouls_committed_per90_percentile_overall', 'fouls_committed_total_overall', 'offsides_per90_percentile_overall', 'min_per_card_percentile_overall', 'cards_per90_percentile_overall', 'booked_over05_overall', 'booked_over05_percentage_overall', 'booked_over05_percentage_percentile_overall'],
    "EFFICIENCY": ['conceded_per_90_overall', 'min_per_conceded_overall', 'min_per_card_overall', 'min_per_assist_overall', 'cards_per_90_overall', 'assists_per_game_overall', 'assists_per90_percentile_overall', 'passes_per_90_overall', 'passes_per_game_overall', 'passes_per90_percentile_overall', 'passes_completed_per_game_overall', 'pass_completion_rate_percentile_overall', 'passes_completed_per_90_overall', 'passes_completed_per90_percentile_overall', 'tackles_per_90_overall', 'tackles_successful_per_game_overall', 'dribbles_successful_per_game_overall', 'shots_per_goal_scored_overall', 'shots_per_90_overall', 'shots_off_target_per_game_overall', 'shots_on_target_per_game_overall', 'possession_regained_per_90_overall', 'possession_regained_per90_percentile_overall', 'shots_per90_percentile_overall', 'shots_on_target_per_90_overall', 'shots_on_target_per90_percentile_overall', 'shots_off_target_per_90_overall', 'shots_off_target_per90_percentile_overall', 'tackles_per90_percentile_overall', 'tackles_successful_per_90_overall', 'tackles_successful_per90_percentile_overall', 'interceptions_per_90_overall', 'interceptions_per90_percentile_overall', 'cross_completion_rate_percentile_overall', 'crosses_per90_percentile_overall', 'through_passes_per90_percentile_overall', 'long_passes_per90_percentile_overall', 'short_passes_per90_percentile_overall', 'key_passes_per90_percentile_overall', 'dribbles_per_90_overall', 'dribbles_per90_percentile_overall', 'dribbles_successful_per_90_overall', 'dribbles_successful_percentage_overall', 'chances_created_per_90_overall', 'chances_created_per90_percentile_overall', 'save_percentage_percentile_overall', 'saves_per_90_overall', 'saves_per90_percentile_overall', 'shots_per_goal_conceded_overall', 'conceded_per90_percentile_overall', 'shots_faced_per_90_overall', 'shots_faced_per90_percentile_overall', 'xg_faced_per_90_overall', 'xg_faced_per90_percentile_overall', 'save_percentage_overall', 'pressures_per_90_overall', 'pressures_per90_percentile_overall', 'pass_completion_rate_overall', 'shot_accuraccy_percentage_overall', 'shot_accuraccy_percentage_percentile_overall', 'dribbled_past_per90_percentile_overall', 'pen_scored_total_overall', 'pen_missed_total_overall', 'blocks_per_game_overall', 'blocks_per_90_overall', 'blocks_total_overall', 'blocks_per90_percentile_overall', 'clearances_per_game_overall', 'pen_save_percentage_overall', 'pens_saved_total_overall', 'pens_taken_total_overall', 'hit_woodwork_total_overall', 'hit_woodwork_per_game_overall', 'hit_woodwork_per_90_overall', 'penalties_won_total_overall', 'shot_conversion_rate_overall', 'shot_conversion_rate_percentile_overall', 'min_per_goal_percentile_overall', 'min_per_conceded_percentile_overall', 'npxg_total_overall', 'npxg_per90_percentile_overall', 'npxg_per_game_overall', 'npxg_per_90_overall', 'xg_per_90_overall', 'xg_per90_percentile_overall', 'clearances_per90_percentile_overall', 'hit_woodwork_per90_percentile_overall', 'aerial_duels_won_per90_percentile_overall', 'aerial_duels_total_overall', 'aerial_duels_per_90_overall', 'aerial_duels_per90_percentile_overall', 'aerial_duels_won_total_overall', 'aerial_duels_won_percentage_overall', 'aerial_duels_won_per_90_overall', 'duels_per_90_overall', 'duels_per_game_overall', 'duels_total_overall', 'duels_won_total_overall', 'duels_won_per90_percentile_overall', 'duels_per90_percentile_overall', 'duels_won_per_90_overall', 'duels_won_per_game_overall', 'duels_won_percentage_overall', 'dispossesed_total_overall', 'dispossesed_per_90_overall', 'dispossesed_per90_percentile_overall', 'progressive_passes_total_overall', 'cross_completion_rate_overall', 'accurate_crosses_total_overall', 'accurate_crosses_per_game_overall', 'accurate_crosses_per_90_overall', 'accurate_crosses_per90_percentile_overall', 'hattricks_total_overall', 'two_goals_in_a_game_total_overall', 'three_goals_in_a_game_total_overall', 'two_goals_in_a_game_percentage_overall', 'three_goals_in_a_game_percentage_overall', 'goals_per90_percentile_overall', 'goals_per90_percentile_away', 'goals_per90_percentile_home', 'man_of_the_match_total_overall', 'clean_sheets_percentage_percentile_overall'],
    "RANKING": ['rank_in_league_top_attackers', 'rank_in_league_top_midfielders', 'rank_in_league_top_defenders', 'rank_in_club_top_scorer'],
    "PLAYER_RATING": ['average_rating_overall', 'ratings_total_overall', 'average_rating_percentile_overall'],
    "PASSING": ['passes_per_90_overall', 'passes_per_game_overall', 'passes_per90_percentile_overall', 'passes_total_overall', 'passes_completed_per_game_overall', 'passes_completed_total_overall', 'pass_completion_rate_percentile_overall', 'passes_completed_per_90_overall', 'passes_completed_per90_percentile_overall', 'short_passes_per_game_overall', 'long_passes_per_game_overall', 'key_passes_per_game_overall', 'key_passes_total_overall', 'through_passes_per_game_overall', 'crosses_per_game_overall', 'crosses_total_overall', 'cross_completion_rate_percentile_overall', 'crosses_per_90_overall', 'crosses_per90_percentile_overall', 'through_passes_total_overall', 'through_passes_per_90_overall', 'through_passes_per90_percentile_overall', 'long_passes_total_overall', 'long_passes_per_90_overall', 'long_passes_per90_percentile_overall', 'short_passes_total_overall', 'short_passes_per_90_overall', 'short_passes_per90_percentile_overall', 'key_passes_per_90_overall', 'key_passes_per90_percentile_overall', 'pass_completion_rate_overall', 'xa_total_overall', 'xa_per90_percentile_overall', 'xa_per_game_overall', 'xa_per_90_overall', 'progressive_passes_total_overall', 'cross_completion_rate_overall', 'accurate_crosses_total_overall', 'accurate_crosses_per_game_overall', 'accurate_crosses_per_90_overall', 'accurate_crosses_per90_percentile_overall'],
    "GOALKEEPER": ["save_percentage_percentile_overall", "save_percentage_percentile_overall", "saves_total_overall", 'is_goalkeeper', 'is_goalkeeper', 'is_goalkeeper', 'inside_box_saves_total_overall', 'saves_per_game_overall', 'saves_per_game_overall', 'shots_faced_per_game_overall', 'saves_total_overall', 'save_percentage_percentile_overall', 'saves_per_90_overall', 'saves_per90_percentile_overall', 'shots_faced_total_overall', 'shots_per_goal_conceded_overall', 'sm_goals_conceded_total_overall', 'sm_goals_conceded_total_overall', 'shots_faced_per_90_overall', 'shots_faced_per90_percentile_overall', 'xg_faced_per_90_overall', 'xg_faced_per90_percentile_overall', 'save_percentage_overall', 'inside_box_saves_total_overall', 'pen_save_percentage_overall', 'pens_saved_total_overall', 'punches_total_overall', 'punches_per_90_overall', 'min_per_conceded_percentile_overall', 'punches_per90_percentile_overall', 'clean_sheets_percentage_percentile_overall'],
    "ATTACKING": ["rank_in_league_top_attackers", 'goals_involved_per_90_overall', 'assists_per_90_overall', 'goals_per_90_overall', 'goals_per_90_home', 'goals_per_90_away', 'min_per_goal_overall', 'dribbles_successful_per_game_overall', 'dribbles_per_game_overall', 'chances_created_per_game_overall', 'dribbles_total_overall', 'dribbles_per_90_overall', 'dribbles_per90_percentile_overall', 'dribbles_successful_total_overall', 'dribbles_successful_per_90_overall', 'dribbles_successful_percentage_overall', 'chances_created_total_overall', 'chances_created_per_90_overall', 'chances_created_per90_percentile_overall', 'dribbled_past_per_game_overall', 'dribbled_past_per_90_overall', 'dribbled_past_total_overall', 'dribbles_successful_per90_percentile_overall', 'dribbles_successful_percentage_percentile_overall', 'offsides_per_90_overall', 'offsides_per_game_overall', 'offsides_total_overall', 'offsides_per90_percentile_overall'],
    "PHYSICAL_STATS": ['distance_travelled_per_game_overall', 'aerial_duels_won_per90_percentile_overall', 'aerial_duels_total_overall', 'aerial_duels_per_90_overall', 'aerial_duels_per90_percentile_overall', 'aerial_duels_won_total_overall', 'aerial_duels_won_percentage_overall', 'aerial_duels_won_per_90_overall', 'duels_per_90_overall', 'duels_per_game_overall', 'duels_total_overall', 'duels_won_total_overall', 'duels_won_per90_percentile_overall', 'duels_per90_percentile_overall', 'duels_won_per_90_overall', 'duels_won_per_game_overall', 'duels_won_percentage_overall', 'distance_travelled_total_overall', 'distance_travelled_per_90_overall', 'distance_travelled_per90_percentile_overall'],
    "POSSESION_BALL_CONTROL": ["rank_in_league_top_midfielders", 'dribbled_past_per_game_overall', 'dribbled_past_per_90_overall', 'dribbled_past_total_overall', 'dribbles_successful_per90_percentile_overall', 'dribbles_successful_percentage_percentile_overall'],
}

COLS_TO_REVERSE = [
    'shots_per_goal_scored_overall', 'shots_off_target_per_game_overall', 'shots_off_target_per_90_overall',
    'shots_off_target_per90_percentile_overall', 'shots_faced_per_game_overall', 'shots_faced_per_90_overall',
    'shots_faced_per90_percentile_overall', 'xg_faced_per_90_overall', 'xg_faced_per90_percentile_overall',
    'xg_faced_per_game_overall', 'xg_faced_total_overall', 'dribbled_past_per_game_overall',
    'dribbled_past_per_90_overall', 'dribbled_past_total_overall', 'offsides_per_90_overall',
    'offsides_per_game_overall', 'offsides_total_overall', 'offsides_per90_percentile_overall',
    'conceded_per_90_overall', 'min_per_conceded_overall', 'min_per_conceded_percentile_overall',
    'conceded_per90_percentile_overall', 'cards_per_90_overall', 'dispossesed_total_overall',
    'dispossesed_per_90_overall', 'dispossesed_per90_percentile_overall','games_subbed_out', 
    'conceded_overall', "hit_woodwork_total_overall",
    'conceded_home', 
    'conceded_away', 
    'yellow_cards_overall', 
    'red_cards_overall', 
    'dispossesed_per_game_overall', 
    'shots_off_target_per_game_overall', 
    'penalty_misses', 
    'dribbled_past_per90_percentile_overall', 
    'pen_committed_total_overall', 
    'pen_committed_per_90_overall', 
    'pen_committed_per90_percentile_overall', 
    'pen_committed_per_game_overall',
    'dispossesed_total_overall', "rank_in_league_top_midfielders", "rank_in_league_top_attackers",
    'dispossesed_per_90_overall', "rank_in_league_top_defenders", "rank_in_club_top_scorer",
    'dispossesed_per90_percentile_overall', 'sm_goals_conceded_total_overall'
]

const PLAYER_CARD = {
    "Attaque": {
        "Centres": [
        "crosses_per_game_overall", "crosses_per_game_overall",
        "accurate_crosses_per_game_overall", "accurate_crosses_per_game_overall", "accurate_crosses_per_game_overall",
        "cross_completion_rate_overall",
        "key_passes_per_game_overall",
        "rank_in_league_top_attackers",
        "sm_goals_scored_total_overall",
        "is_shooter"
        ],
        "Finition": [
        "goals_overall",
        "shots_on_target_per_90_overall", "shots_on_target_per_90_overall",
        "shot_conversion_rate_overall", "shot_conversion_rate_overall",
        "hit_woodwork_total_overall",
        "rank_in_club_top_scorer",
        "rank_in_league_top_attackers",
        "is_shooter"
        ],
        "Jeu de tête": [
        "aerial_duels_won_per_game_overall",
        "aerial_duels_won_per90_percentile_overall",
        "aerial_duels_won_total_overall",
        "rank_in_club_top_scorer",
        "rank_in_league_top_attackers"
        ],
        "Ouvre le jeu": [
        "passes_completed_per_game_overall", "passes_completed_per_game_overall",
        "pass_completion_rate_overall",
        "key_passes_per_90_overall",
        "passes_per_90_overall",
        "key_passes_per_game_overall",
        "rank_in_league_top_midfielders",
        "rank_in_league_top_attackers",
        "sm_minutes_played_recorded_overall",
        "goals_involved_per90_percentile_overall"
        ]
    },
    "Technique": {
        "Dribbles": [
        "dribbles_per_game_overall", "dribbles_per_game_overall",
        "dribbles_successful_per_game_overall", "dribbles_successful_per_game_overall",
        "dribbles_successful_percentage_overall",
        "dribbles_per_90_overall",
        "rank_in_league_top_midfielders",
        "rank_in_club_top_scorer"
        ],
        "Contrôle du ballon": [
        "dispossesed_per_game_overall", "dispossesed_per_game_overall", "dispossesed_per_game_overall",
        "interceptions_per_game_overall", "interceptions_per_game_overall",
        "passes_completed_per_game_overall",
        "fouls_drawn_per_game_overall",
        "dribbles_successful_per_game_overall", "dribbles_successful_per_game_overall",
        "offsides_total_overall", "offsides_total_overall",
        "rank_in_league_top_midfielders",
        "goals_involved_per90_percentile_overall",
        ],
        "Créativité": [
        "key_passes_per_game_overall",
        "assists_overall", "assists_overall",
        "sm_assists_total_overall", "sm_goals_scored_total_overall",
        "dribbled_past_per_game_overall",
        "sm_minutes_played_recorded_overall",
        "passes_total_overall",
        "offsides_total_overall",
        "goals_involved_per90_percentile_overall",
        ]
    },
    "Mouvement": {
        "Accélération et Vitesse": [
        "aerial_duels_won_total_overall",
        "duels_per_game_overall",
        "interceptions_per_game_overall",
        "dribbles_per_game_overall",
        "rank_in_club_top_scorer",
        "rank_in_league_top_attackers"
        ],
        "Agilité": [
        "dribbles_successful_percentage_overall",
        "fouls_drawn_per_game_overall",
        "dribbles_per_game_overall",
        "dispossesed_per_game_overall",
        "rank_in_league_top_midfielders"
        ],
        "Équilibre": [
        "duels_won_percentage_overall",
        "aerial_duels_won_total_overall",
        "interceptions_per_game_overall",
        "fouls_committed_per_game_overall",
        "rank_in_league_top_midfielders"
        ]
    },
    "Défense": {
        "Interceptions": [
        "interceptions_per_game_overall",
        "interceptions_total_overall",
        "interceptions_per_90_overall",
        "duels_per_game_overall",
        "rank_in_league_top_defenders",
        "is_defender"
        ],
        "Tacles": [
        "tackles_per_game_overall",
        "interceptions_total_overall",
        "tackles_per_90_overall",
        "is_defender"
        ],
        "Marquage": [
        "blocks_per_game_overall",
        "clearances_per_game_overall",
        "duels_won_per_game_overall",
        "interceptions_per_game_overall",
        "rank_in_league_top_defenders",
        "is_defender"
        ]
    },
    "Physique": {
        "Endurance": [
        "minutes_played_overall", "minutes_played_overall",
        "matches_played_percentile_overall", "matches_played_percentile_overall",
        "min_per_match", "min_per_match", 
        "games_subbed_out",
        "clean_sheets_overall",
        ],
        "Force": [
        "duels_won_percentage_overall",
        "duels_per_game_overall",
        "aerial_duels_won_total_overall",
        "interceptions_per_game_overall", "interceptions_per_game_overall",
        "saves_total_overall",
        "clearances_per_game_overall", "clearances_per_game_overall",
        "minutes_played_overall",
        ],
        "Sauts": [
        "aerial_duels_won_per90_percentile_overall",
        "aerial_duels_won_total_overall",
        "minutes_played_overall",
        ]
    },
    "Gardien": {
        "Arrêts": [
        "shots_faced_per_game_overall",
        "saves_total_overall", "saves_total_overall",
        "save_percentage_percentile_overall", "save_percentage_percentile_overall", "save_percentage_percentile_overall",
        "punches_total_overall", "punches_total_overall", "punches_total_overall",
        "sm_goals_conceded_total_overall",
        "conceded_overall",
        'pens_saved_total_overall', 
        "clean_sheets_overall",
        "is_goalkeeper", "is_goalkeeper", "is_goalkeeper", "is_goalkeeper", "is_goalkeeper"
        ],
        "Réflexes": [
        "save_percentage_percentile_overall",
        "saves_per_game_overall",
        "sm_goals_conceded_total_overall",
        "clearances_per_game_overall",
        "clean_sheets_overall",
        'pens_saved_total_overall', 'pens_saved_total_overall',
        'inside_box_saves_total_overall', 'inside_box_saves_total_overall',
        "is_goalkeeper", "is_goalkeeper", "is_goalkeeper"
        ],
        "Sorties": [
        "save_percentage_percentile_overall",
        "clearances_per_game_overall",
        "interceptions_total_overall",
        "passes_total_overall",
        "is_goalkeeper", "is_goalkeeper", "is_goalkeeper"
        ]
    }
}

let VALUES_CARD_STATS = {}

COLORS = ["#e35763", "#f4ca13", "#68a068", "#436ebf", "#55b3e7", "#9364e3"]

function get_color() {
    available_colors = COLORS.filter(color => !Object.values(ctx.selected_players).includes(color))
    return available_colors[0]
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
        './data/clubs_logo.csv'
    ]

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
        agg_players_data()
        populate_players()
    }).catch(error => console.error("Error loading the data:", error))
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

                // if player position is Goalkeeper set is_goalkeeper to 1 else 0
                if (player["position"] == "Goalkeeper") {
                    player["is_goalkeeper"] = 1
                } else {
                    player["is_goalkeeper"] = 0
                }

                // if is forward set is_shooter to 1 else 0 (because shooting can merge with goalkeeping)
                if (player["position"] == "Forward") {
                    player["is_shooter"] = 1
                } else {
                    player["is_shooter"] = 0
                }

                // is_defender because not enough stats for defenders
                if (player["position"] == "Defender") {
                    player["is_defender"] = 1
                } else {
                    player["is_defender"] = 0
                } 
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

    // if min == max, remove the column from categories
    Object.keys(minmax).forEach(key => {
        if (minmax[key].min == minmax[key].max) {
            Object.keys(cols_categories).forEach(category => {
                cols = cols_categories[category]
                if (cols.includes(key)) {
                    cols_categories[category] = cols.filter(col => col != key)
                    console.log("Removed column <", key, "> from category <", category, ">")
                }
            })
        }
    })

    // 1. bis: remove category.cols if not in minmax
    Object.keys(cols_categories).forEach(category => {
        cols = cols_categories[category]
        cols_categories[category] = cols.filter(col => minmax[col] != undefined)
    })

    // 2. normalize the data by category

    Object.keys(ctx.data["players_agg"]).forEach(playerId => {
        Object.keys(ctx.data["players_agg"][playerId]).forEach(season => {
            player_data = ctx.data["players_agg"][playerId][season]

            Object.keys(cols_categories).forEach(category => {
                cols = cols_categories[category]
                category_values = {}
                cols.forEach(col => {
                    // normalize the data
                    // if is not a number, set to the value
                    if (isNaN(player_data[col])) {
                        category_values[col] = player_data[col]
                    } else {
                        category_values[col] = (player_data[col] - minmax[col].min) / (minmax[col].max - minmax[col].min)

                        // if NaN, set to the value
                        if (isNaN(category_values[col])) category_values[col] = player_data[col]
                        if (COLS_TO_REVERSE.includes(col)) category_values[col] = 1 - category_values[col]
                    }
                })

                ctx.data["players_agg"][playerId][season][category] = category_values
            })
        });
    })

    // same but for player card

    // we want add to the players all the normalized data avg on the seasons
    // player_data[player_id]['card_stats'] = {sub_category: avg_value}
    Object.keys(ctx.data["players_agg"]).forEach(playerId => {
        player_data = ctx.data["players_agg"][playerId]
        cards_stats = {}

        // chacune des categories
        Object.keys(PLAYER_CARD).forEach(category => {
            indicators = PLAYER_CARD[category] // liste des indicators

            Object.keys(indicators).forEach(indicator => {
                cols = indicators[indicator]
                
                avg_cols_over_seasons = cols.map(col => {
                    return Object.keys(player_data).reduce((acc, season) => {
                        if (minmax[col] == undefined) return acc
                        minmax_value = (player_data[season][col] - minmax[col].min) / (minmax[col].max - minmax[col].min)
                        if (COLS_TO_REVERSE.includes(col)) minmax_value = 1 - minmax_value
                        return acc + minmax_value
                    }, 0) / Object.keys(player_data).length
                })

                cards_stats[indicator] = avg_cols_over_seasons
            })
        })

        // ctx.data["players_agg"][playerId]["card_stats"] = cards_stats
        VALUES_CARD_STATS[playerId] = cards_stats
    })
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
        table_row = table_body.append("tr")
        years = Object.keys(player).sort()
        current_club = player[years[years.length - 1]]["Current_Club"]
        player_name = player[years[years.length - 1]]["full_name"]

        table_row.append("td").text(current_club)
        table_row.append("td").text(player_name)
        table_row.append("td").text(player[years[years.length - 1]]["position"])
        table_row.append("td").append("img").attr("src", ctx.data["nationalities_flag"][player[years[years.length - 1]]["nationality"]])
        table_row.attr("id", player_id)
            .attr("player_name", player_name.toLowerCase())
            .attr("current_club", current_club.toLowerCase())
            .attr("position", player[years[years.length - 1]]["position"])
            .attr("nationality", player[years[years.length - 1]]["nationality"])
            .attr("is-visible", "true")

        table_row.on("click", function() {
            player_id = this.id
            if (Object.keys(ctx.selected_players).includes(player_id)) {
                // selected player is an object, remove it
                delete ctx.selected_players[player_id]
                d3.select(this).classed("selected", false)
            } else {
                if (Object.keys(ctx.selected_players).length >= COLORS.length) {
                    toast('warning', `You can't select more than ${COLORS.length} players`)
                    return
                }
                // player_id =  color
                ctx.selected_players[player_id] = get_color()
                d3.select(this).classed("selected", true)
            }

            update_players_charts()
            update_players_tags()
        })
    })

    pagination()

    create_radar("#spider-chart-2021-2022", RADAR_CATEGORIES)
    create_radar("#spider-chart-2022-2023", RADAR_CATEGORIES)
    create_radar("#spider-chart-2023-2024", RADAR_CATEGORIES)

    // add nationalities to the filter
    nationalities = Object.keys(ctx.data["nationalities_flag"]).filter(n => n != "Flag_URL").sort()
    nationality_select = d3.select("#nationality-select")
    nationality_select.selectAll("option")
        .data(nationalities)
        .enter()
        .append("option")
        .text(d => d)


    // pre draw distribution chart
    Object.keys(PLAYER_CARD).forEach(category => {
        indicators = PLAYER_CARD[category]
        Object.keys(indicators).forEach(indicator => {
            draw_distribution_chart(indicator, PLAYER_CARD[category][indicator])
        })
    })
}

function pagination() {
    var table = document.querySelector('table');
    var rows = table.querySelectorAll('tr[is-visible="true"]');
    var rpp = 15 - 1; // rows per page
    var rows_length = rows.length;

    for (var i = 1; i < rows_length; i++) {
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
            
            for (var j = 1; j < rows_length; j++) {
                if (j > rpp * (p - 1) && j <= rpp * p) {
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
    const width = 350;
    const height = 350;

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
        .attr("width", config.w + 200)
        .attr("height", config.h + 200)
        .append("g")
        .attr("transform", `translate(${config.w / 2 + 100}, ${config.h / 2 + 100})`);

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
        .style("fill", "#CDCDCD")
        .style("stroke", "#ccc")
        .style("fill-opacity", 0.03);

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
        .style("stroke", "#999")
        .style("stroke-width", "1.5px");

    axis.append("text")
        .attr("class", "legend")
        .attr("x", (d, i) => rScale(config.maxValue * 1.25) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(config.maxValue * 1.25) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("text-anchor", "middle")
        .text(d => d)
        .style("font-size", "11px");

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
        .style("fill", d => d.color)
        .style("fill-opacity", 0.3)
        // hover effect: glow + display name
        .on("mouseover", function(d) {
            d3.select(this).style("fill-opacity", 0.7);
            d3.select(this).style("stroke", d3.rgb(d.color).darker());
            d3.select(this).style("stroke-width", "2px");
        })
        .on("mouseout", function() {
            d3.select(this).style("fill-opacity", 0.2);
            d3.select(this).style("stroke", "none");
        })
        .append("title")
        .text(d => d.name);

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
    tags_wrapper.selectAll("span").remove()
    tags_wrapper.selectAll("span")
        .data(Object.keys(ctx.selected_players))
        .enter()
        .append("span")
        .text(player_id => ctx.data["players_agg"][player_id][Object.keys(ctx.data["players_agg"][player_id])[0]]["full_name"])
        .style("background-color", player_id => ctx.selected_players[player_id])
        .on("click", function(event, player_id) {
            delete ctx.selected_players[player_id]
            // unselect the player
            d3.select(`tr#${player_id}`).classed("selected", false)
            d3.select(this).remove()
            update_players_charts()
        })
        .style("cursor", "pointer")
        .style("color", "white")
}

function update_players_charts() {
    // select the players data
    players_data = Object.keys(ctx.selected_players).map(player_id => ctx.data["players_agg"][player_id])


    current_player_2021_2022 = players_data.filter(player => Object.keys(player).includes("2021-2022"))
    const data_2021_2022 = current_player_2021_2022.map(player => {
        return {
            name: player["2021-2022"]["full_name"],
            color: ctx.selected_players[get_player_id(player["2021-2022"])],
            axes: RADAR_CATEGORIES.map((category, i) => {
                return {
                    axis: category,
                    value: Math.max(0, sum_dict(player["2021-2022"][category]) / Object.keys(player["2021-2022"][category]).length),
                    axisIndex: i
                }
            })
        }
    })

    current_player_2022_2023 = players_data.filter(player => Object.keys(player).includes("2022-2023"))
    const data_2022_2023 = current_player_2022_2023.map(player => {
        return {
            name: player["2022-2023"]["full_name"],
            color: ctx.selected_players[get_player_id(player["2022-2023"])],
            axes: RADAR_CATEGORIES.map((category, i) => {
                return {
                    axis: category,
                    value: Math.max(0, sum_dict(player["2022-2023"][category]) / Object.keys(player["2022-2023"][category]).length),
                    axisIndex: i
                }
            })
        }
    })

    current_player_2023_2024 = players_data.filter(player => Object.keys(player).includes("2023-2024"))
    const data_2023_2024 = current_player_2023_2024.map(player => {
        return {
            name: player["2023-2024"]["full_name"],
            color: ctx.selected_players[get_player_id(player["2023-2024"])],
            axes: RADAR_CATEGORIES.map((category, i) => {
                return {
                    axis: category,
                    value: Math.max(0, sum_dict(player["2023-2024"][category]) / Object.keys(player["2023-2024"][category]).length),
                    axisIndex: i
                }
            })
        }
    })
    d3.select("#spider-chart-2021-2022").selectAll(".radarWrapper").remove()
    d3.select("#spider-chart-2022-2023").selectAll(".radarWrapper").remove()
    d3.select("#spider-chart-2023-2024").selectAll(".radarWrapper").remove()

    // create player card
    d3.select(".players-card").selectAll(".player-card").remove()
    Object.keys(ctx.selected_players).forEach(player_id => {
        create_player_card(player_id)
    })

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

function create_player_card(player_id) {
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

    cards_wrapper = d3.select(".players-card")

    player_card = cards_wrapper.append("div")
        .attr("class", "player-card")
        .attr("id", player_id)
        .style("border-color", ctx.selected_players[player_id])

    head_card = player_card.append("div").attr("class", "head-card")
    player_identity = head_card.append("div").attr("class", "player-identity")

    player_identity.append("span").text(player_number).style("color", ctx.selected_players[player_id]).attr("class", "player-number")
    player_identity_data = player_identity.append("div").attr("class", "player-identity-data")
    
    player_identity_data.append("h2").text(player_name)
    player_identity_data.append("span")
        .append("h5").text(player_position)
        .text(player_position)
    
    player_identity_data.select("span").append("img").attr("src", ctx.data["nationalities_flag"][player_nationality]).attr("class", "flag")
    
    
    // happen club logo
    head_card.append("img").attr("src", ctx.data["clubs_logo"][player_club])
        .attr("class", "club-logo")
        .append("title").text(player_club)

    // add the categories
    Object.keys(PLAYER_CARD).forEach(category => {
        category_wrapper = player_card.append("div").attr("class", "category")
        category_wrapper.append("h5").text(category)

        Object.keys(PLAYER_CARD[category]).forEach(sub_category => {
            sub_category_wrapper = category_wrapper.append("div").attr("class", "sub-category")
            sub_category_wrapper.append("h6").text(sub_category)

            total_value = 0
            VALUES_CARD_STATS[player_id][sub_category].forEach(value => {
                total_value += value
            })
            total_value = total_value / VALUES_CARD_STATS[player_id][sub_category].length
            
            closest_seuil = Object.keys(seuils).reduce((a, b) => Math.abs(b - total_value) < Math.abs(a - total_value) ? b : a)
            closest_seuil = seuils[closest_seuil]

            sub_category_wrapper.append("progress")
                .attr("value", total_value)
                .attr("max", 1)
                .attr("seuil", closest_seuil)
                // on hover, display chart distribution
                .on("mouseover", function(event) {
                    console.log("mouseover", get_indicator_id(sub_category))
                    distribution_chart = d3.select(`.distribution-charts #${get_indicator_id(sub_category)}`)
                    distribution_chart.classed("show", true)
                    
                    // position on top of the progress bar
                    progress_bar_x = event.target.getBoundingClientRect().x
                    progress_bar_y = event.target.getBoundingClientRect().y
                    distribution_chart.style("top", `${progress_bar_y - 15 - ctx.distribution_chart_height}px`)
                    distribution_chart.style("left", `${progress_bar_x - 50}px`)

                    // color the bar where total_value is the closest
                    value = d3.select(this).attr("value")
                    value_on_tick = Math.round(value / 0.05) * 0.05
                    console.log("value_on_tick", value_on_tick, value)
                    distribution_chart.selectAll("rect").style("fill", "#668cd0")
                    distribution_chart.selectAll("rect").filter(function(d) {
                        return d == value_on_tick
                    }
                    ).style("fill", "#61d4c1")
                })
                .on("mouseout", function() {
                    distribution_chart = d3.select(`.distribution-charts #${get_indicator_id(sub_category)}`)
                    distribution_chart.classed("show", false)
                })
        })
    })
}

function get_indicator_id(indicator) {
    return indicator.replaceAll(" ", "-").toLowerCase()
}

function draw_distribution_chart(indicator, cols) {
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
        player = VALUES_CARD_STATS[player_id]
        player_values = player[indicator]
        total_value = 0
        player_values.forEach(value => {
            total_value += value
        })
        total_value = total_value / player_values.length
        data.push(total_value)
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

    console.log(data_by_tick)


    // create the x scale
    x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, ctx.distribution_chart_width - 100])

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
