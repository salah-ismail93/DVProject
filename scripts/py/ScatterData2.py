# All the import 
import numpy as np
import pandas as pd
# read files
data = pd.read_csv("C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DVProject/DVProject/data/owid-covid-data.csv")
# print(data.columns)
data.tail()
# Basic information about all the columns of the data
data.info()
data_2 = pd.read_csv("C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DVProject/DVProject/data/world-happiness-report-2021.csv")
data_2['Regional_indicator'] = data_2['Regional indicator']
data_2['Regional_indicator']
data_2 = data_2.set_index('Country name')
df = data.join(data_2, on="location")
df
df['Regional indicator']
df = df[df['continent'] == 'Asia'] 
df['date'] = pd.to_datetime(df['date'] )
df['year'] = pd.DatetimeIndex(df['date']).year
df['month'] = pd.DatetimeIndex(df['date']).month
df.loc[df['location']=='Bhutan','Regional_indicator'] = 'South Asia'
df.loc[df['location']=='Brunei','Regional_indicator'] = 'Southeast Asia'
df.loc[df['location']=='Timor','Regional_indicator'] = 'Southeast Asia'
df.loc[df['location']=='Hong Kong','Regional_indicator'] = 'East Asia'
df.loc[df['location']=='Macao','Regional_indicator'] = 'East Asia'
df.loc[df['location']=='Taiwan','Regional_indicator'] = 'East Asia'
df.loc[df['location']=='North Korea','Regional_indicator'] = 'East Asia'
df.loc[df['location']=='Syria','Regional_indicator'] = 'Middle East and North Africa'
df.loc[df['location']=='Northern Cyprus','Regional_indicator_'] = 'Middle East and North Africa'
df.loc[df['location']=='Oman','Regional_indicator'] = 'Middle East and North Africa'
df.loc[df['location']=='Palestine','Regional_indicator'] = 'Middle East and North Africa'
df['Regional_indicator_id'] = df.groupby(['Regional_indicator']).ngroup()

# df['region'] = 
df.loc[df['Regional_indicator_id']==3, 'region'] = 'SA'
df.loc[df['Regional_indicator_id']==2, 'region'] = 'ME'
df.loc[df['Regional_indicator_id']==1, 'region'] = 'EA'
df.loc[df['Regional_indicator_id']==4, 'region'] = 'SEA'
df.loc[df['Regional_indicator_id']==0, 'region'] = 'CWIS'

df.head(6000)
df_grouped = df.groupby(by=['Regional_indicator','Regional_indicator_id','location']).agg({'region':'max','total_cases':'max','population':'max','aged_65_older':'max'}) 
df_grouped = df_grouped.reset_index()
df_grouped['total_cases_share'] = df_grouped['total_cases']/df_grouped['population'] * 100
df_grouped = df_grouped.sort_values(by=["total_cases"], ascending=False).reset_index(drop=True)
# df_grouped_top = df_grouped[0:10]
locations = df_grouped['location']
df_grouped = df_grouped.dropna()
df_grouped
df_grouped.to_csv('C:/Users/salah.ismail/OneDrive - unige.it/2nd term/unige.it/Data Visualization - 90529 - 2022-23/DVProject/DVProject/data/scatter_data2.csv',index=False,header=True)