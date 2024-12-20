import pandas as pd

# Création d'un DataFrame
path = './data/players/spain-2021-2022.csv'
df = pd.read_csv(path)

# Supposons que df est votre DataFrame
colonnes_numeriques = df.select_dtypes(include='number').columns

colonnes_filtrees = []

# for col in colonnes_numeriques:
#     valeurs_uniques = df[col].dropna().unique()
#     colonnes_filtrees.append(col)
print(len(df.columns))