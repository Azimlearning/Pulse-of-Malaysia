import pandas as pd
import os

# Set up data directory
data_dir = r'c:\Users\User\Documents\Coding\Hackathon\UKM Datachallange\data'
output_dir = r'c:\Users\User\Documents\Coding\Hackathon\UKM Datachallange\docs\eda_results'
os.makedirs(output_dir, exist_ok=True)

print("--- Starting Basic Data Prep ---")

# 1. Load Datasets
try:
    lfs_district = pd.read_csv(os.path.join(data_dir, 'lfs_district.csv'))
    death_district = pd.read_csv(os.path.join(data_dir, 'death_district_sex.csv'))
    
    # 2. Basic Cleaning
    lfs_district['date'] = pd.to_datetime(lfs_district['date'])
    death_district['date'] = pd.to_datetime(death_district['date'])
    
    print("Files loaded and date column formatted.")

    # 3. Join on Key Columns (State, District, Date)
    merged = pd.merge(lfs_district, death_district[death_district['sex'] == 'both'], 
                      on=['state', 'district', 'date'], 
                      suffixes=('_lfs', '_death'))
    
    # Calculate Correlation as a proof of concept
    corr = merged['u_rate'].corr(merged['rate_death'])
    print(f"Correlation (Unemployment vs Crude Death Rate): {corr:.4f}")

    # 4. Generate Regional Summary for Mockup/Prototype
    regional_summary = merged.groupby(['state', 'date'])[['u_rate', 'rate_death']].mean().reset_index()
    regional_summary.to_csv(os.path.join(data_dir, 'regional_summary_2020.csv'), index=False)
    print("Exported: regional_summary_2020.csv")

except Exception as e:
    print(f"Error during Data Prep: {e}")
