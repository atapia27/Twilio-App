# scripts/create_api_key.py

import os
from twilio.rest import Client
from dotenv import load_dotenv

# Get the absolute path of the .env file
env_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path=env_path)

# Debug: print loaded environment variables
print(f"TWILIO_ACCOUNT_SID: {os.getenv('TWILIO_ACCOUNT_SID')}")
print(f"TWILIO_AUTH_TOKEN: {os.getenv('TWILIO_AUTH_TOKEN')}")

# Your Account SID and Auth Token from twilio.com/console
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')

if not account_sid or not auth_token:
    raise Exception("Environment variables TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are required")

client = Client(account_sid, auth_token)

# Create an API Key
api_key = client.new_keys.create(friendly_name="My API Key")

print(f"SID: {api_key.sid}")
print(f"Secret: {api_key.secret}")

# Store these values in the .env file
with open(env_path, 'a') as f:
    f.write(f'TWILIO_API_KEY_SID={api_key.sid}\n')
    f.write(f'TWILIO_API_KEY_SECRET={api_key.secret}\n')
