import numpy as np
import pandas as pd

DATA_PATH = 'C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DVProject/data'
all_data_csv = f'{DATA_PATH}/owid-covid-data.csv'
total_deaths_csv = f'{DATA_PATH}/total_deaths.csv'
output_file = f'{DATA_PATH}/world_total_death_pie_data.csv'

# Read the dataset
data = pd.read_csv(all_data_csv)
data_info = data.info()
data_shape = data.shape

# Select relevant columns
df_countries = data[["iso_code", "continent", "location", "date", "total_deaths",
                     "new_deaths", "new_deaths_smoothed", "total_deaths_per_million",
                     "new_deaths_per_million", "new_deaths_smoothed_per_million"]]
df_countries_head = df_countries.head()

# Convert date column to datetime
df_countries["date"] = pd.to_datetime(df_countries["date"], format="%Y-%m-%d")
df_countries_info = df_countries.info()
df_countries_head_30 = df_countries.head(30)

# Find rows with missing continent values
null_continent = df_countries[df_countries["continent"].isna()]
sum_null_continent = null_continent.groupby("location").count()

# Find rows with non-null total_deaths values
not_null_total_deaths = df_countries[df_countries["total_deaths"].notna()]
not_null_total_deaths_shape = not_null_total_deaths.shape
not_null_total_deaths_head_50 = not_null_total_deaths.head(50)

# Get unique ISO codes and continents
unique_iso_codes = data["iso_code"].unique()
continents = data["continent"].dropna().unique()

# Group locations by continent
continent_df = data.groupby("continent")["location"].apply(list).to_dict()
asian_countries_lst = list(set(continent_df["Asia"]))

# Read total deaths dataset
total_death_df = pd.read_csv(total_deaths_csv)
total_death_df_info = total_death_df.info()

# Select columns corresponding to continents
cont_total_death_df = total_death_df[["date"] + list(continents)]

# Find data for the most recent date
most_recent_date = cont_total_death_df["date"].max()
most_recent_td = cont_total_death_df[cont_total_death_df["date"] == most_recent_date]

# Calculate total deaths and percentage for each continent
sum_world_td = most_recent_td.iloc[:, 1:].sum()
melted_df = most_recent_td.melt(var_name="continent", value_name="total_no_deaths")
melted_df_cont = melted_df.iloc[1:, :].reset_index(drop=True)
melted_df_cont["percentage"] = (melted_df_cont["total_no_deaths"] / sum_world_td.sum()) * 100

# Save melted dataframe to a CSV file with percentage values
melted_df_cont.to_csv(output_file,
                      index=False, header=True, float_format="%.15f")
