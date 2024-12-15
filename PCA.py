import pandas as pd
from sklearn.decomposition import PCA
import os
# Step 1: Load the data (replace with your actual data file)
df = pd.DataFrame()
for file in os.listdir('./data/players/'):
    if file.endswith('.csv'):
        df = pd.concat([df, pd.read_csv(os.path.join('./data/players/', file))])

print("Data loaded successfully!")

# Assuming your dataframe has 'Name' and 'Birthday' columns and some indicators/features
# Add an ID column by concatenating 'Name' and 'Birthday' (ensure they exist in the dataset)
def get_id(row):
    print(row['full_name'])
    return str(row['full_name']).replace(" ", '-').lower() + '-' + str(row['birthday'])

df['ID'] = df.apply(get_id, axis=1)

# Step 2: Calculate the average of each row based on the ID
# Exclude non-numeric columns (like 'Name', 'Birthday', and 'ID')
numeric_columns = df.select_dtypes(include=['float64', 'int64']).columns


# Group by 'ID' and calculate the mean for each group
averaged_df = df.groupby('ID')[numeric_columns].mean().reset_index()

# normalize the data (min-max scaling)
averaged_df[numeric_columns] = (averaged_df[numeric_columns] - averaged_df[numeric_columns].min()) / (
        averaged_df[numeric_columns].max() - averaged_df[numeric_columns].min())

# Replace NaN values with 0
averaged_df.fillna(0, inplace=True)

# retirer les colonnes avec des valeurs nulles (qu'une seule valeur)
averaged_df = averaged_df.dropna(axis=1, how='all')

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
    'conceded_overall', 
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
    'dispossesed_total_overall', 
    'dispossesed_per_90_overall', 
    'dispossesed_per90_percentile_overall'
]

for col in COLS_TO_REVERSE:
    if col in averaged_df.columns:
        averaged_df[col] = 1 - averaged_df[col]
print("Data averaged successfully!")

print(averaged_df)

# Step 3: Apply PCA on the averaged data (excluding 'ID')
pca = PCA(n_components=2)
reduced_data = pca.fit_transform(averaged_df[numeric_columns])

# Create a new dataframe to hold PCA components along with the ID
pca_df = pd.DataFrame(reduced_data, columns=['PC1', 'PC2'])
pca_df['ID'] = averaged_df['ID']

# Output the resulting PCA + ID dataframe
pca_df.to_csv('reduced_data_with_id.csv', index=False)

# Optionally, print the resulting PCA DataFrame
print(pca_df)
