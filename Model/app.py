import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

# 1. Load Data
df = pd.read_csv('ObesityCSV.csv')

# 2. Separate Features (X) and Target (y)
X = df.drop('NObeyesdad', axis=1)
y = df['NObeyesdad']

# 3. Define feature groups
categorical_features = ['Gender', 'family_history_with_overweight', 'FAVC', 'CAEC', 'SMOKE', 'SCC', 'CALC', 'MTRANS']
numerical_features = ['Age', 'Height', 'Weight', 'FCVC', 'NCP', 'CH2O', 'FAF', 'TUE']

# 4. Create a Preprocessing Pipeline
# This ensures that raw input from the web app is automatically transformed (encoded/scaled)
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# 5. Create the full Model Pipeline
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# 6. Train the model
print("Training model...")
pipeline.fit(X, y)
print("Model trained.")

# 7. Save the pipeline to a file
joblib.dump(pipeline, 'obesity_model.joblib')
print("Model saved as 'obesity_model.joblib'")