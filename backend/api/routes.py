from flask import request, jsonify, Blueprint, current_app, g

from data import (
    get_all_categories,
    get_category_questions,
    get_category_info,
    get_random_questions,
    get_all_questions,
    get_legacy_data,
    get_main_competency_info,
    get_all_questions_for_main_competency,
    calculate_sub_competency_scores
)
from auth import require_auth, optional_auth

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


@api_bp.route("/competencies", methods=["GET"])
def get_main_competencies():
    """Get all main competency areas"""
    competencies = {}
    for i in range(1, 6):  # Competencies 1-5
        competency_info = get_main_competency_info(str(i))
        competencies[str(i)] = competency_info

    return jsonify(competencies), 200


@api_bp.route("/competencies/<competency_id>", methods=["GET"])
def get_main_competency(competency_id):
    """Get a main competency with all its sub-competencies and questions"""
    competency_info = get_main_competency_info(competency_id)
    if not competency_info["sub_competencies"]:
        return jsonify({"error": "Competency not found"}), 404

    # Get all questions for this competency
    all_questions = get_all_questions_for_main_competency(competency_id)

    return jsonify({
        "competency": competency_info,
        "questions": all_questions
    }), 200


@api_bp.route("/analyse", methods=["POST"])
@require_auth
def analyse():
    """Analyze quiz results with sub-competency competence levels - requires authentication"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Get user info from authenticated request
    user_data = g.user
    user_id = user_data.get('user_id') if user_data else None
    username = user_data.get('username') if user_data else None

    # Extract answers and questions from request
    answers = data.get('answers', [])
    questions = data.get('questions', [])
    competency_id = data.get('competency_id')

    if not answers or not questions:
        return jsonify({"error": "Answers and questions are required"}), 400

    # Calculate sub-competency competence levels
    sub_competency_competences = calculate_sub_competency_scores(
        answers, questions)

    # Calculate overall competency level
    total_score = sum(answers)
    max_possible_score = len(answers) * 3  # Assuming 0-3 scale
    overall_competence_percentage = round(
        (total_score / max_possible_score) * 100, 2) if max_possible_score > 0 else 0

    # Get the least confident sub-competency for special attention
    least_confident = list(sub_competency_competences.items(
    ))[-1] if sub_competency_competences else None

    # Todo: Save results to database with user_id and username

    return jsonify({
        "message": "Analysis completed successfully",
        "user_id": user_id,
        "username": username,
        "competency_id": competency_id,
        "overall_competence": {
            "total": total_score,
            "max_possible": max_possible_score,
            "percentage": overall_competence_percentage
        },
        "sub_competency_competences": sub_competency_competences,
        "least_confident_sub_competency": least_confident,
        "answers": answers
    }), 200


# Legacy endpoint for backward compatibility
@api_bp.route("/legacy/questions", methods=["GET"])
def get_legacy_questions():
    """Get questions in the original flat format"""
    legacy_data = get_legacy_data()
    return jsonify(legacy_data), 200
