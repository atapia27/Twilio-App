# backend/main.py

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS middleware
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
API_KEY_SID = os.getenv("TWILIO_API_KEY_SID")
API_KEY_SECRET = os.getenv("TWILIO_API_KEY_SECRET")

class TokenRequest(BaseModel):
    identity: str

@app.post("/token")
def generate_token(request: TokenRequest):
    try:
        token = AccessToken(
            ACCOUNT_SID,
            API_KEY_SID,
            API_KEY_SECRET,
            identity=request.identity
        )
        video_grant = VideoGrant()
        token.add_grant(video_grant)
        jwt_token = token.to_jwt()
        return {"token": jwt_token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# To run the server: uvicorn main:app --reload
