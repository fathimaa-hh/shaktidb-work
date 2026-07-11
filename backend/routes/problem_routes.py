from flask import Blueprint, request
from services.problem_service import (
    add_problem,
    get_all_problems
)
from utils.response import success_response, error_response

problem_bp = Blueprint("problem", __name__)


@problem_bp.route("/problems", methods=["POST"])
def create_problem():

    data = request.get_json()

    required_fields = [
        "user_id",
        "problem_id",
        "attempts",
        "time_taken",
        "language",
        "notes"
    ]

    for field in required_fields:

        if field not in data:

            return error_response(f"{field} is required.")

    success, message = add_problem(

        data["user_id"],
        data["problem_id"],
        data["attempts"],
        data["time_taken"],
        data["language"],
        data["notes"]

    )

    if success:

        return success_response(
            message,
            status_code=201
        )

    return error_response(message)

@problem_bp.route("/problems/<int:user_id>", methods=["GET"])
def view_all_problems(user_id):

    success, result = get_all_problems(user_id)

    if success:

        return success_response(
            "Problems retrieved successfully.",
            result
        )

    return error_response(result)