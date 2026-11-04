from flask import Blueprint, request, session

from services.problem_service import (
    add_problem,
    get_all_problems,
    get_problem_by_id,
    update_problem,
    delete_problem,
    get_available_problems
)

from utils.response import success_response, error_response
from utils.auth import login_required

problem_bp = Blueprint("problem", __name__)


@problem_bp.route("/problems", methods=["POST"])
@login_required
def create_problem():
    data = request.get_json()

    if not data:
        return error_response("No JSON data received.")

    required_fields = [
        "problem_id", "status", "attempts",
        "time_taken", "language", "notes"
    ]

    for field in required_fields:
        if field not in data:
            return error_response(f"{field} is required.")

    if data["status"] not in ["Solved", "Attempted"]:
        return error_response("Invalid problem status.")

    success, message = add_problem(
        session["user_id"],
        data["problem_id"],
        data["status"],
        data["attempts"],
        data["time_taken"],
        data["language"],
        data["notes"]
    )

    if success:
        return success_response(message, status_code=201)

    return error_response(message)


@problem_bp.route("/problems/<int:user_id>", methods=["GET"])
@login_required
def view_all_problems(user_id):
    if user_id != session["user_id"]:
        return error_response("Access denied.", 403)

    success, result = get_all_problems(session["user_id"])

    if success:
        return success_response("Problems retrieved successfully.", result)

    return error_response(result)


@problem_bp.route("/problem/<int:history_id>", methods=["GET"])
@login_required
def view_problem(history_id):
    success, result = get_problem_by_id(history_id, session["user_id"])

    if success:
        return success_response("Problem retrieved successfully.", result)

    return error_response(result, 404)


@problem_bp.route("/problem/<int:history_id>", methods=["PUT"])
@login_required
def edit_problem(history_id):
    data = request.get_json()

    if not data:
        return error_response("No JSON data received.")

    required_fields = [
        "status", "attempts", "time_taken", "language", "notes"
    ]

    for field in required_fields:
        if field not in data:
            return error_response(f"{field} is required.")

    if data["status"] not in ["Solved", "Attempted"]:
        return error_response("Invalid problem status.")

    success, message = update_problem(
        history_id,
        session["user_id"],
        data["status"],
        data["attempts"],
        data["time_taken"],
        data["language"],
        data["notes"]
    )

    if success:
        return success_response(message)

    return error_response(message, 404)


@problem_bp.route("/problem/<int:history_id>", methods=["DELETE"])
@login_required
def remove_problem(history_id):
    success, message = delete_problem(history_id, session["user_id"])

    if success:
        return success_response(message)

    return error_response(message, 404)


@problem_bp.route("/available-problems", methods=["GET"])
def view_available_problems():
    success, result = get_available_problems()

    if success:
        return success_response(
            "Available problems retrieved successfully.", result
        )

    return error_response(result)