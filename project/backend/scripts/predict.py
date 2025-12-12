import sys
import json
import os
import joblib
import pandas as pd
import warnings

# Suppress warnings
warnings.filterwarnings("ignore")

def load_models():
    # Define paths
    # Models are now located in "models" folder relative to project root
    # Project root is one level up from "scripts" which contains this file.
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir) # .../website/biofit3d-web
    models_dir = os.path.join(project_root, 'models')
    
    if not os.path.exists(models_dir):
        # Fallback for dev environment or different structure
        # Log warning or try alternative paths if needed
        pass

    try:
        model_temp = joblib.load(os.path.join(models_dir, "xgb_model_temp.joblib"))
        model_dwell = joblib.load(os.path.join(models_dir, "xgb_model_dwell.joblib"))
        return model_temp, model_dwell
    except Exception as e:
        print(json.dumps({"error": f"Failed to load models from {models_dir}: {str(e)}"}))
        sys.exit(1)

def predict(data):
    try:
        model_temp, model_dwell = load_models()
        
        # Prepare input dataframe
        # Expected features: ["initial_temp_C", "heating_rate_C_per_s", "time_to_50C_sec"]
        df = pd.DataFrame([data])
        
        # Predict
        pred_temp = model_temp.predict(df)[0]
        pred_dwell = model_dwell.predict(df)[0]
        
        return {
            "recommended_temp": float(pred_temp),
            "recommended_dwell": float(pred_dwell)
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    try:
        # Read input from stdin
        input_str = sys.stdin.read()
        if not input_str:
            print(json.dumps({"error": "No input data provided"}))
            sys.exit(1)
            
        data = json.loads(input_str)
        result = predict(data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": f"script execution failed: {str(e)}"}))
