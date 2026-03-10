import pandas as pd
import os

# Inspecting available datasets
data_dir = 'data'
files = [f for f in os.listdir(data_dir) if f.endswith('.csv')]

print(f"Found {len(files)} CSV files: {files}")

for file in files:
    path = os.path.join(data_dir, file)
    print(f"\n--- Inspecting {file} ---")
    try:
        df = pd.read_csv(path, nrows=5)
        print("Columns:", df.columns.tolist())
        print("Sample data:")
        print(df)
    except Exception as e:
        print(f"Error reading {file}: {e}")
