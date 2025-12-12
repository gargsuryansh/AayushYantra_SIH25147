
# Auto-generated script from BioFit3D_training_notebook.ipynb

import os, joblib, json
import numpy as np, pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
import matplotlib
matplotlib.use('Agg') # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import xgboost as xgb
import shap

# Display settings
pd.set_option('display.max_columns', 50)
pd.set_option('display.width', 200)

RANDOM_STATE = 42
DATA_PATH = "combined_dataset_301.csv"
OUT_DIR = "models_artifacts"
os.makedirs(OUT_DIR, exist_ok=True)

print('Ready. Data path:', DATA_PATH)

# Load data
if not os.path.exists(DATA_PATH):
    print(f"Error: {DATA_PATH} not found.")
    exit(1)

df = pd.read_csv(DATA_PATH)
print('Rows:', len(df))
print(df.head())

# Quick summary statistics
print(df.describe().T)
print('\nMissing values per column:')
print(df.isna().sum())

# Select features and labels
FEATURES = ["initial_temp_C", "heating_rate_C_per_s", "time_to_50C_sec"]
LABEL_TEMP = "final_temp_setpoint_C"
LABEL_DWELL = "final_dwell_time_s"

# Drop rows with NaN in essential columns
df_clean = df[FEATURES + [LABEL_TEMP, LABEL_DWELL]].dropna().reset_index(drop=True)
print('Rows after dropping NaNs:', len(df_clean))

X = df_clean[FEATURES].copy()
y_temp = df_clean[LABEL_TEMP].copy()
y_dwell = df_clean[LABEL_DWELL].copy()

# Train-test split
X_train, X_test, ytemp_train, ytemp_test, ydwell_train, ydwell_test = train_test_split(
    X, y_temp, y_dwell, test_size=0.2, random_state=RANDOM_STATE
)

print('Train size:', len(X_train), 'Test size:', len(X_test))

# Baseline: predict mean
mean_temp = ytemp_train.mean()
mean_dwell = ydwell_train.mean()

temp_baseline_mae = mean_absolute_error(ytemp_test, [mean_temp]*len(ytemp_test))
dwell_baseline_mae = mean_absolute_error(ydwell_test, [mean_dwell]*len(ydwell_test))
print('Baseline MAE (temp):', temp_baseline_mae)
print('Baseline MAE (dwell):', dwell_baseline_mae)

# Common xgboost parameters
params = dict(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=5,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=RANDOM_STATE,
    n_jobs=-1,
    early_stopping_rounds=30
)

# Train temperature model
print("Training temperature model...")
model_temp = xgb.XGBRegressor(**params)
model_temp.fit(X_train, ytemp_train, eval_set=[(X_test, ytemp_test)], verbose=False)
ytemp_pred = model_temp.predict(X_test)

# Train dwell model
print("Training dwell model...")
model_dwell = xgb.XGBRegressor(**params)
model_dwell.fit(X_train, ydwell_train, eval_set=[(X_test, ydwell_test)], verbose=False)
ydwell_pred = model_dwell.predict(X_test)

# Save models
joblib.dump(model_temp, os.path.join(OUT_DIR, "xgb_model_temp.joblib"))
joblib.dump(model_dwell, os.path.join(OUT_DIR, "xgb_model_dwell.joblib"))
print('Models trained and saved to', OUT_DIR)

# Evaluation metrics
def regression_metrics(y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100.0
    return {"mae": mae, "rmse": rmse, "mape_percent": mape}

temp_metrics = regression_metrics(ytemp_test.values, ytemp_pred)
dwell_metrics = regression_metrics(ydwell_test.values, ydwell_pred)

print('Temperature metrics:', temp_metrics)
print('Dwell metrics:', dwell_metrics)

temp_accuracy_pct = 100 - (temp_metrics["mae"] / ytemp_test.mean() * 100.0)
dwell_accuracy_pct = 100 - (dwell_metrics["mae"] / ydwell_test.mean() * 100.0)
print(f"Rough temperature accuracy ~= {temp_accuracy_pct:.2f}% (based on MAE)")
print(f"Rough dwell accuracy ~= {dwell_accuracy_pct:.2f}% (based on MAE)")

# Save importance plot
fig, ax = plt.subplots(1,2, figsize=(12,5))
xgb.plot_importance(model_temp, ax=ax[0], importance_type='gain', title='Temp model importance')
xgb.plot_importance(model_dwell, ax=ax[1], importance_type='gain', title='Dwell model importance')
plt.tight_layout()
plt.savefig(os.path.join(OUT_DIR, "feature_importance.png"))
print("Saved feature importance plot.")

# SHAP explanations
# print("Calculating SHAP values...")
# explainer_temp = shap.TreeExplainer(model_temp)
# sample = X_train.sample(n=min(200, len(X_train)), random_state=RANDOM_STATE)
# shap_values_temp = explainer_temp.shap_values(sample)
# plt.figure()
# shap.summary_plot(shap_values_temp, sample, show=False)
# plt.savefig(os.path.join(OUT_DIR, "shap_summary.png"))
# print("Saved SHAP summary plot.")

# Save test predictions
preds = X_test.copy().reset_index(drop=True)
preds['ytemp_true'] = ytemp_test.reset_index(drop=True)
preds['ytemp_pred'] = ytemp_pred
preds['ydwell_true'] = ydwell_test.reset_index(drop=True)
preds['ydwell_pred'] = ydwell_pred
preds.to_csv(os.path.join(OUT_DIR, "test_predictions.csv"), index=False)
print('Saved test predictions to', os.path.join(OUT_DIR, "test_predictions.csv"))

# Save evaluation report
eval_report = {"temp_metrics": temp_metrics, "dwell_metrics": dwell_metrics}
with open(os.path.join(OUT_DIR, "evaluation_report.json"), "w") as f:
    json.dump(eval_report, f, indent=2)
print('Saved evaluation report to', os.path.join(OUT_DIR, "evaluation_report.json"))
