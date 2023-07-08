import pandas as pd

df = pd.read_csv('C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DVProject/data/owid-covid-data.csv')

df = df[df['continent'] == 'Asia']
df['date'] = pd.to_datetime(df['date'])
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month

grouped_data = df.groupby(['date', 'location'])['new_cases'].sum().unstack().reset_index()
grouped_data.rename(columns={'India': 'India', 'Indonesia': 'Indonesia', 'Iran': 'Iran',
                             'Israel': 'Israel', 'Japan': 'Japan', 'Malaysia': 'Malaysia',
                             'South Korea': 'South Korea', 'Thailand': 'Thailand',
                             'Turkey': 'Turkey', 'Vietnam': 'Vietnam'}, inplace=True)

grouped_data.to_csv('C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DVProject/data/line_data.csv', index=False)

print("CSV file generated successfully!")
