from flask import Blueprint, request, session

from services.achievement_service import (
    add_achievement,
    get_achievements,
    delete_achievement
)

from utils.response import success_response, error_response
from utils.auth import login_required

achievement_bp = Blueprint("achievement", __name__)


@achievement_bp.route("/achievements", methods=["POST"])
@login_required
def create_achievement():
    data = request.get_json()

    required = ["achievement_name", "description"]

    if not data:
        return error_response("No JSON data received.")

    for field in required:
        if field not in data:
            return error_response(f"{field} is required.")

    success, message = add_achievement(
        session["user_id"],
        data["achievement_name"],
        data["description"]
    )

    if success:
        return success_response(message, status_code=201)

    return error_response(message)


@achievement_bp.route("/achievements/<int:user_id>", methods=["GET"])
@login_required
def fetch_achievements(user_id):
    if user_id != session["user_id"]:
        return error_response("Access denied.", 403)

    success, result = get_achievements(session["user_id"])

    if success:
        return success_response("Achievements fetched successfully.", result)

    return error_response(result)


@achievement_bp.route("/achievement/<int:achievement_id>", methods=["DELETE"])
@login_required
def remove_achievement(achievement_id):
    success, message = delete_achievement(
        achievement_id, session["user_id"]
    )

    if success:
        return success_response(message)

    return error_response(message, 404)