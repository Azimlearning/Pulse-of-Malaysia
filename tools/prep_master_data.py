import pandas as pd
import os

# Set up data directory
data_dir = r'c:\Users\User\Documents\Coding\Hackathon\UKM Datachallange\data'
master_csv = os.path.join(data_dir, 'master_crisis_data.csv')

def prep_master():
    print("--- Finalizing Master Dataset ---")
    
    # 1. Official Suicide Stats 2023 (Source: OpenDOSM 2024 Report)
    suicide_data = [
        {'state': 'Selangor', 'suicides_2023': 305},
        {'state': 'W.P. Kuala Lumpur', 'suicides_2023': 135},
        {'state': 'Johor', 'suicides_2023': 123},
        {'state': 'Pulau Pinang', 'suicides_2023': 123},
        {'state': 'Perak', 'suicides_2023': 85},
        {'state': 'Kedah', 'suicides_2023': 60},
        {'state': 'Sarawak', 'suicides_2023': 50},
        {'state': 'Sabah', 'suicides_2023': 45},
        {'state': 'Negeri Sembilan', 'suicides_2023': 40},
        {'state': 'Pahang', 'suicides_2023': 35},
        {'state': 'Melaka', 'suicides_2023': 25},
        {'state': 'Kelantan', 'suicides_2023': 20},
        {'state': 'Terengganu', 'suicides_2023': 15},
        {'state': 'Perlis', 'suicides_2023': 5},
        {'state': 'W.P. Labuan', 'suicides_2023': 11}, # Estimated distribution of remaining
        {'state': 'W.P. Putrajaya', 'suicides_2023': 6}
    ]
    df_suicide = pd.DataFrame(suicide_data)
    
    # 2. Add Economic Indicator (Unemployment 2023)
    # Since lfs_district might missing some, we use 2022/2023 stats from general sources if needed
    # For now, let's just use what we have and Fill NaNs with regional averages
    try:
        lfs = pd.read_csv(os.path.join(data_dir, 'lfs_district.csv'))
        lfs['date'] = pd.to_datetime(lfs['date'])
        lfs_2022 = lfs[lfs['date'].dt.year == 2022].groupby('state')['u_rate'].mean().reset_index()
        
        # Mapping names if necessary
        # W.P. Kuala Lumpur might be missing in lfs_district
        # Let's check lfs_2022 names
        print("LFS States available:", lfs_2022['state'].tolist())
        
        master = pd.merge(df_suicide, lfs_2022, on='state', how='left')
        
        # Fill missing with national average (~3.5%)
        master['u_rate'] = master['u_rate'].fillna(3.5)
        
        # 3. Add Risk Score (Simplified)
        # Risk = normalized(suicides) * 0.7 + normalized(u_rate) * 0.3
        master['risk_score'] = (master['suicides_2023'] / master['suicides_2023'].max()) * 70 + (master['u_rate'] / master['u_rate'].max()) * 30
        
        master.to_csv(master_csv, index=False)
        print(f"Master dataset saved to {master_csv}")
        print(master)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    prep_master()
