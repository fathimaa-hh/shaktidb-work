from flask import Blueprint, request

from services.activity_service import (
    add_activity,
    get_all_activities,
    get_activity_by_id,
    update_activity,
    delete_activity
)
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

@activity_bp.route("/activities/<int:user_id>", methods=["GET"])
def fetch_activities(user_id):

    success, result = get_all_activities(user_id)

    if success:
        return success_response(
            "Activities fetched successfully.",
            result
        )

    return error_response(result)

@activity_bp.route("/activity/<int:activity_id>", methods=["GET"])
def fetch_activity(activity_id):

    success, result = get_activity_by_id(activity_id)

    if success:
        return success_response(
            "Activity fetched successfully.",
            result
        )

    return error_response(result, 404)

@activity_bp.route("/activity/<int:activity_id>", methods=["PUT"])
def edit_activity(activity_id):

    data = request.get_json()

    if not data:
        return error_response("No JSON data received.")

    required_fields = [
        "practice_date",
        "coding_minutes",
        "problems_solved"
    ]

    for field in required_fields:
        if field not in data:
            return error_response(f"{field} is required.")

    success, message = update_activity(
        activity_id,
        data["practice_date"],
        data["coding_minutes"],
        data["problems_solved"]
    )

    if success:
        return success_response(message)

    return error_response(message, 404)

@activity_bp.route("/activity/<int:activity_id>", methods=["DELETE"])
def remove_activity(activity_id):

    success, message = delete_activity(activity_id)

    if success:
        return success_response(message)

    return error_response(message, 404)