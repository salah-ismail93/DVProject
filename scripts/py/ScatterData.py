import pandas as pd
import numpy as np

# Read the COVID-19 data
covid_data = pd.read_csv('C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DVProject/data/owid-covid-data.csv')
print(covid_data)

# Read the World Happiness Report data
happiness_data = pd.read_csv('C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DVProject/data/world-happiness-report-2021.csv')
happiness_data['Regional_indicator'] = happiness_data['Regional indicator']
happiness_data = happiness_data.set_index('Country name')

# Merge COVID-19 and Happiness Report data
merged_data = covid_data.join(happiness_data, on="location")

# Filter data for Asia
asia_data = merged_data[merged_data['continent'] == 'Asia']
asia_data['year'] = pd.DatetimeIndex(asia_data['date']).year
asia_data['month'] = pd.DatetimeIndex(asia_data['date']).month

# Assign regional indicators based on country
asia_data.loc[asia_data['location'] == 'Bhutan', 'Regional_indicator'] = 'South Asia'
asia_data.loc[asia_data['location'] == 'Brunei', 'Regional_indicator'] = 'Southeast Asia'
asia_data.loc[asia_data['location'] == 'Timor', 'Regional_indicator'] = 'Southeast Asia'
asia_data.loc[asia_data['location'] == 'Hong Kong', 'Regional_indicator'] = 'East Asia'
asia_data.loc[asia_data['location'] == 'Macao', 'Regional_indicator'] = 'East Asia'
asia_data.loc[asia_data['location'] == 'Taiwan', 'Regional_indicator'] = 'East Asia'
asia_data.loc[asia_data['location'] == 'North Korea', 'Regional_indicator'] = 'East Asia'
asia_data.loc[asia_data['location'] == 'Syria', 'Regional_indicator'] = 'Middle East and North Africa'
asia_data.loc[asia_data['location'] == 'Northern Cyprus', 'Regional_indicator'] = 'Middle East and North Africa'
asia_data.loc[asia_data['location'] == 'Oman', 'Regional_indicator'] = 'Middle East and North Africa'
asia_data.loc[asia_data['location'] == 'Palestine', 'Regional_indicator'] = 'Middle East and North Africa'

# Assign regions based on Regional_indicator_id
asia_data['Regional_indicator_id'] = asia_data.groupby(['Regional_indicator']).ngroup()
region_mapping = {3: 'SA', 2: 'ME', 1: 'EA', 4: 'SEA', 0: 'CWIS'}
asia_data['region'] = asia_data['Regional_indicator_id'].map(region_mapping)

# Group data by Regional_indicator and location
grouped_data = asia_data.groupby(['Regional_indicator', 'location']).agg({
    'region': 'max',
    'total_cases': 'max',
    'total_deaths': 'max',
    'diabetes_prevalence': 'max',
    'handwashing_facilities': 'max',
    'hospital_beds_per_thousand': 'max',
    'human_development_index': 'max',
    'gdp_per_capita': 'max',
    'population': 'max',
    'people_fully_vaccinated': 'max'
}).reset_index()

# Calculate ratios and case fatality rate
grouped_data['ratio_total_cases'] = grouped_data['total_cases'] / grouped_data['population'] * 100
grouped_data['ratio_total_deaths'] = grouped_data['total_deaths'] / grouped_data['population'] * 100
grouped_data['ratio_total_vaccinations'] = grouped_data['people_fully_vaccinated'] / grouped_data['population'] * 100
grouped_data['case_fatality_rate'] = grouped_data['total_deaths'] / grouped_data['total_cases']

# Sort data by case fatality rate
grouped_data = grouped_data.sort_values(by='case_fatality_rate')

# Save the grouped data to a CSV file
grouped_data.to_csv('C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DVProject/data/scatter_data.csv', index=False, header=True)
