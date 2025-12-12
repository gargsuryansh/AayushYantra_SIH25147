import pandas as pd
import os

# Data is in the root, which is 3 levels up from scripts/check_data.py?
# scripts/check_data.py
# biofit3d-web/scripts
# website/biofit3d-web
# website (2)/website
# actually root is website (2).

# Let's try to locate the file
possible_paths = [
    "../../combined_dataset_301.csv",
    "../../../combined_dataset_301.csv",
    "combined_dataset_301.csv"
]

path = None
for p in possible_paths:
    if os.path.exists(p):
        path = p
        break

if path:
    df = pd.read_csv(path)
    print(df.describe().T)
    # Also print correlation
    feature_cols = ["initial_temp_C", "heating_rate_C_per_s", "time_to_50C_sec"]
    label_cols = ["final_temp_setpoint_C", "final_dwell_time_s"]
    print("\nCorrelations:")
    print(df[feature_cols + label_cols].corr())
else:
    print("Could not find dataset")
