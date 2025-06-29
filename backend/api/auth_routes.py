from flask import request, jsonify, Blueprint, make_response
from auth import register_user, login_user, logout_user, verify_session, require_auth

auth_bp = Blueprint('auth', __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters long"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long"}), 400

    result = register_user(username, password, email)

    if result["success"]:
        return jsonify(result), 201
    else:
        return jsonify(result), 400


@auth_bp.route("/login", methods=["POST"])
def login():
    """Login a user"""
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    result = login_user(username, password)

    if result["success"]:
        response = make_response(jsonify(result))
        # Set session token as HTTP-only cookie
        response.set_cookie(
            'session_token',
            result['session_token'],
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite='Lax',
            max_age=86400  # 24 hours
        )
        return response, 200
    else:
        return jsonify(result), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Logout a user"""
    session_token = request.cookies.get('session_token')

    result = logout_user(session_token)

    response = make_response(jsonify(result))
    # Remove the session cookie
    response.delete_cookie('session_token')
    return response, 200


@auth_bp.route("/profile", methods=["GET"])
@require_auth
def profile():
    """Get current user profile"""
    return jsonify({
        "user": request.user
    }), 200


@auth_bp.route("/verify", methods=["GET"])
def verify():
    """Verify if user is authenticated"""
    session_token = request.cookies.get('session_token')
    user = verify_session(session_token)

    if user:
        return jsonify({
            "authenticated": True,
            "user": user
        }), 200
    else:
        return jsonify({
            "authenticated": False
        }), 401
