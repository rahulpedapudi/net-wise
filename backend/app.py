from api.auth_routes import auth_bp
from api.routes import api_bp
from flask import Flask
from pymongo import MongoClient
from flask_cors import CORS
import os

app = Flask(__name__)

# Set secret key for sessions
app.secret_key = os.getenv(
    'SECRET_KEY', 'your-secret-key-change-in-production')

client = MongoClient("")

db = client["netwise"]
collection = db["netwise-db"]

CORS(app, origins=["http://localhost:5173"], supports_credentials=True)


app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

if __name__ == '__main__':
    app.run(port=5000, debug=True, threaded=True)
