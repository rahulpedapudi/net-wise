from flask import request, jsonify, Blueprint, current_app

api_bp = Blueprint('api', __name__)


@api_bp.route("/test", methods=["POST"])
def test():
    return jsonify({"message": "Data saved successfully"}), 200
