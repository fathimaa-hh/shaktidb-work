from flask import Blueprint, request

from services.activity_service import add_activity
from utils.response import success_response, error_response

activity_bp = Blueprint("activity", __name__)


@activity_bp.route("/activities", methods=["POST"])
def create_activity():

    data = request.get_json()

    if not data:
        return error_response("No JSON data received.")

    required_fields = [
        "user_id",
        "practice_date",
        "coding_minutes",
        "problems_solved"
    ]

    for field in required_fields:
        if field not in data:
            return error_response(f"{field} is required.")

    success, message = add_activity(
        data["user_id"],
        data["practice_date"],
        data["coding_minutes"],
        data["problems_solved"]
    )

    if success:
        return success_response(message, status_code=201)

    return error_response(message)