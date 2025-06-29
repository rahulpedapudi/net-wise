import hashlib
import secrets
import string
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, session, g
from pymongo import MongoClient
from bson import ObjectId
import os

# MongoDB connection
client = MongoClient(
    "mongodb+srv://rahulpedapudi01:Q6KC8S2yOvebW7ko@net-wise.x65vbp9.mongodb.net/")
db = client["netwise"]
users_collection = db["users-db"]

# Session configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')


def hash_password(password):
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


def generate_session_token():
    """Generate a random session token"""
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))


def register_user(username, password, email=None):
    """Register a new user"""
    # Check if username already exists
    if users_collection.find_one({"username": username}):
        return {"success": False, "message": "Username already exists"}

    # Check if email already exists (if provided)
    if email and users_collection.find_one({"email": email}):
        return {"success": False, "message": "Email already exists"}

    # Create user document
    user = {
        "username": username,
        "password": hash_password(password),
        "email": email,
        "created_at": datetime.utcnow(),
        "last_login": None
    }

    try:
        result = users_collection.insert_one(user)
        return {"success": True, "message": "User registered successfully", "user_id": str(result.inserted_id)}
    except Exception as e:
        return {"success": False, "message": f"Registration failed: {str(e)}"}


def login_user(username, password):
    """Authenticate a user and create a session"""
    # Find user by username
    user = users_collection.find_one({"username": username})

    if not user:
        return {"success": False, "message": "Invalid username or password"}

    # Check password
    if user["password"] != hash_password(password):
        return {"success": False, "message": "Invalid username or password"}

    # Generate session token
    session_token = generate_session_token()

    # Update last login
    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )

    # Store session in database
    session_data = {
        "user_id": str(user["_id"]),
        "username": user["username"],
        "token": session_token,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(hours=24)  # 24 hour session
    }

    # Store in sessions collection (create if doesn't exist)
    sessions_collection = db["sessions"]
    sessions_collection.insert_one(session_data)

    return {
        "success": True,
        "message": "Login successful",
        "session_token": session_token,
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user.get("email")
        }
    }


def verify_session(session_token):
    """Verify if a session token is valid"""
    if not session_token:
        return None

    sessions_collection = db["sessions"]
    session_data = sessions_collection.find_one({
        "token": session_token,
        "expires_at": {"$gt": datetime.utcnow()}
    })

    if not session_data:
        return None

    try:
        # Get user data - convert string user_id back to ObjectId
        user = users_collection.find_one(
            {"_id": ObjectId(session_data["user_id"])})
        if not user:
            return None

        return {
            "user_id": str(user["_id"]),
            "username": user["username"],
            "email": user.get("email")
        }
    except Exception as e:
        print(f"Error verifying session: {e}")
        return None


def logout_user(session_token):
    """Logout a user by removing their session"""
    if session_token:
        sessions_collection = db["sessions"]
        sessions_collection.delete_one({"token": session_token})
    return {"success": True, "message": "Logout successful"}


def require_auth(f):
    """Decorator to require authentication for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get session token from header or cookie
        session_token = request.headers.get(
            'Authorization', '').replace('Bearer ', '')
        if not session_token:
            session_token = request.cookies.get('session_token')

        user = verify_session(session_token)
        if not user:
            return jsonify({"error": "Authentication required"}), 401

        # Add user info to request
        g.user = user
        return f(*args, **kwargs)

    return decorated_function


def optional_auth(f):
    """Decorator for optional authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session_token = request.headers.get(
            'Authorization', '').replace('Bearer ', '')
        if not session_token:
            session_token = request.cookies.get('session_token')

        user = verify_session(session_token)
        g.user = user  # Will be None if not authenticated
        return f(*args, **kwargs)

    return decorated_function
