from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
from typing import Optional
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing.image import img_to_array, load_img
from io import BytesIO
from PIL import Image
import numpy as np
import pandas as pd
import pickle
from sklearn.preprocessing import StandardScaler


class HouseFeatures(BaseModel):
    BHK: float
    Size: float
    Bathroom: float
    Floor_Ratio: float
    Area_Type_Built_Area: float
    Area_Type_Carpet_Area: float
    Area_Type_Super_Area: float
    City_Bangalore: float
    City_Chennai: float
    City_Delhi: float
    City_Hyderabad: float
    City_Kolkata: float
    City_Mumbai: float
    Furnishing_Status_Furnished: float
    Furnishing_Status_Semi_Furnished: float
    Furnishing_Status_Unfurnished: float
    Tenant_Preferred_Bachelors: float
    Tenant_Preferred_Bachelors_Family: float
    Tenant_Preferred_Family: float
    Point_of_Contact_Contact_Agent: float
    Point_of_Contact_Contact_Builder: float
    Point_of_Contact_Contact_Owner: float

class Prediction(BaseModel):
    price: float

app = FastAPI()


origins = [
    "http://localhost:3000",
    "localhost:3000",
    "https://ecs-111-project.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load the ResNet50 
# model pre-trained on ImageNet data
model = tf.keras.models.load_model("app/model.h5")

# Load scaler
with open('app/scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Assuming the HouseFeatures model and the model for predictions are defined elsewhere

@app.post("/classify")
async def classify_result(features: HouseFeatures):
    try:
        # Convert the Pydantic model instance to a DataFrame
        # Assuming you meant features.dict() instead of model_dump() which is not a standard Pydantic method

        # Convert column names to original model column names
        column_names = [
            'BHK',
            'Size',
            'Bathroom',
            'Floor_Ratio',
            'Area Type_Built Area',
            'Area Type_Carpet Area',
            'Area Type_Super Area',
            'City_Bangalore',
            'City_Chennai',
            'City_Delhi',
            'City_Hyderabad',
            'City_Kolkata',
            'City_Mumbai',
            'Furnishing Status_Furnished',
            'Furnishing Status_Semi-Furnished',
            'Furnishing Status_Unfurnished',
            'Tenant Preferred_Bachelors',
            'Tenant Preferred_Bachelors/Family',
            'Tenant Preferred_Family',
            'Point of Contact_Contact Agent',
            'Point of Contact_Contact Builder',
            'Point of Contact_Contact Owner'
        ]

        # 
        adjusted_features = {}

        for i, name in enumerate(column_names):
            adjusted_features[name] = list(features.dict().values())[i]

        data = scaler.transform(pd.DataFrame([adjusted_features]))
        
        try:
            # Make predictions with the model
            prediction = model.predict(data)
        except Exception as e:
            # Handle exceptions raised during the prediction
            raise HTTPException(status_code=500, detail=f"Error during model prediction: {str(e)}")
        
        # Ensure the prediction is in the expected format
        if prediction is None or not isinstance(prediction, (list, np.ndarray)):
            raise ValueError("The model's prediction is not in a valid format.")
        
    except ValidationError as e:
        # Handle validation errors from Pydantic
        raise HTTPException(status_code=422, detail=f"Validation error: {e.errors()}")
    except ValueError as e:
        # Handle issues with the prediction format
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        # Catch-all for any other unexpected errors
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    # Prepare the response
    formatted_response = {
        "prediction": prediction.tolist()[0][0]  # Assuming the prediction is 2D and you want the first element
    }
    
    return formatted_response


@app.get("/")
def hello_world():
    return {"message": "OK"}
