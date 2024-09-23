import pickle
import sys
import json
import pandas as pd 

import xgboost 

# Load the model
with open('C:/Users/mooha/Documents/Rapport Stage/Projet du Stage Mohammed Manouni/CreditCardFraud/fraud_detection_model.pkl', 'rb') as file:
    model = pickle.load(file)

# Check if a file path was provided
if len(sys.argv) > 1:
    try:
        file_path = sys.argv[1]
        with open(file_path, 'r') as file:
            data = json.load(file)

            # Ensure the DataFrame has the correct feature names
            feature_names = ['type', 'amount', 'oldbalanceOrg', 'oldbalanceDest', 'newbalanceDest']
            df = pd.DataFrame([data], columns=feature_names)

            # Make prediction
            prediction = model.predict(df)

            # Print the prediction
            print(prediction[0])

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)
else:
    print("No data received")
    sys.exit(1)
