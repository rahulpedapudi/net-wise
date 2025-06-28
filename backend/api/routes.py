from flask import request, jsonify, Blueprint, current_app
from ..data import (
    get_all_categories,
    get_category_questions,
    get_category_info,
    get_random_questions,
    get_all_questions,
    get_legacy_data
)

api_bp = Blueprint('api', __name__)


@api_bp.route("/categories", methods=["GET"])
def get_categories():
    """Get all available categories"""
    categories = get_all_categories()
    return jsonify(categories), 200


@api_bp.route("/categories/<category_id>", methods=["GET"])
def get_category(category_id):
    """Get specific category information and questions"""
    category_info = get_category_info(category_id)
    if not category_info:
        return jsonify({"error": "Category not found"}), 404

    questions = get_category_questions(category_id)
    return jsonify({
        "category": category_info,
        "questions": questions
    }), 200


@api_bp.route("/categories/<category_id>/questions", methods=["GET"])
def get_questions_by_category(category_id):
    """Get questions for a specific category"""
    questions = get_category_questions(category_id)
    if not questions:
        return jsonify({"error": "Category not found or no questions available"}), 404

    return jsonify(questions), 200


@api_bp.route("/categories/<category_id>/random", methods=["GET"])
def get_random_category_questions(category_id):
    """Get random questions from a specific category"""
    count = request.args.get('count', 5, type=int)
    questions = get_random_questions(category_id, count)
    if not questions:
        return jsonify({"error": "Category not found or no questions available"}), 404

    return jsonify(questions), 200


@api_bp.route("/questions", methods=["GET"])
def get_all_questions_route():
    """Get all questions from all categories"""
    questions = get_all_questions()
    return jsonify(questions), 200


@api_bp.route("/questions/search", methods=["GET"])
def search_questions():
    """Search questions by keyword"""
    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    all_questions = get_all_questions()
    results = []

    for question in all_questions:
        if query.lower() in question['statement'].lower():
            results.append(question)

    return jsonify(results), 200


@api_bp.route("/analyse", methods=["POST"])
def analyse():
    """Analyze quiz results"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    # Todo: add the analysis logic here
    return jsonify({"message": "Data saved successfully"}), 200


# Legacy endpoint for backward compatibility
@api_bp.route("/legacy/questions", methods=["GET"])
def get_legacy_questions():
    """Get questions in the original flat format"""
    legacy_data = get_legacy_data()
    return jsonify(legacy_data), 200
