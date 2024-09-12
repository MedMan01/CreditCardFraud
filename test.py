import xgboost as xgb
import numpy as np
import pandas as pd

# Simuler un DataFrame pour test
X = pd.DataFrame({
    'type': [1, 2, 3],
    'amount': [10.0, 20.0, 30.0],
    'oldbalanceOrg': [10.0, 20.0, 30.0],
    'oldbalanceDest': [10.0, 20.0, 30.0],
    'newbalanceDest': [10.0, 20.0, 30.0]
})
y = np.array([0, 1, 0])

# Créer et entraîner le modèle
model = xgb.XGBClassifier()
model.fit(X, y)

# Sauvegarder le modèle
model.save_model('test_model.pkl')

# Charger le modèle
loaded_model = xgb.XGBClassifier()
loaded_model.load_model('test_model.pkl')

# Créer un DMatrix
dmatrix = xgb.DMatrix(X, enable_categorical=True)

# Faire la prédiction
prediction = loaded_model.predict(dmatrix)
print(prediction)
