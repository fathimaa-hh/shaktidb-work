from flask import Blueprint, request, session

from services.contest_service import (
    add_contest,
    get_all_contests,
    get_contest_by_id,
    update_contest,
    delete_contest,
    get_all_platforms
)

from utils.response import success_response, error_response
from utils.auth import login_required

contest_bp = Blueprint("contest", __name__)


@contest_bp.route("/contests", methods=["POST"])
@login_required
def create_contest():
    data = request.get_json()

    required_fields = [
        "contest_name", "platform_id", "rank", "score", "contest_date"
    ]

    if not data:
        return error_response("No JSON data received.")

    for field in required_fields:
        if field not in data:
            return error_response(f"{field} is required.")

    success, message = add_contest(
        session["user_id"],
        data["platform_id"],
        data["contest_name"],
        data["rank"],
        data["score"],
        data["contest_date"]
    )

    if success:
        return success_response(message, status_code=201)

    return error_response(message)


@contest_bp.route("/contests/<int:user_id>", methods=["GET"])
@login_required
def fetch_contests(user_id):
    if user_id != session["user_id"]:
        return error_response("Access denied.", 403)

    success, result = get_all_contests(session["user_id"])

    if success:
        return success_response("Contests fetched successfully.", result)

    return error_response(result)


@contest_bp.route("/contest/<int:contest_id>", methods=["GET"])
@login_required
def fetch_contest(contest_id):
    success, result = get_contest_by_id(contest_id, session["user_id"])

    if success:
        return success_response("Contest fetched successfully.", result)

    return error_response(result, 404)


@contest_bp.route("/contest/<int:contest_id>", methods=["PUT"])
@login_required
def edit_contest(contest_id):
    data = request.get_json()

    required_fields = [
        "platform_id", "contest_name", "rank", "score", "contest_date"
    ]

    if not data:
        return error_response("No JSON data received.")

    for field in required_fields:
        if field not in data:
            return error_response(f"{field} is required.")

    success, message = update_contest(
        contest_id,
        session["user_id"],
        data["platform_id"],
        data["contest_name"],
        data["rank"],
        data["score"],
        data["contest_date"]
    )

    if success:
        return success_response(message)

    return error_response(message, 404)


@contest_bp.route("/contest/<int:contest_id>", methods=["DELETE"])
@login_required
def remove_contest(contest_id):
    success, message = delete_contest(contest_id, session["user_id"])

    if success:
        return success_response(message)

    return error_response(message, 404)


@contest_bp.route("/platforms", methods=["GET"])
def fetch_platforms():
    success, result = get_all_platforms()

    if success:
        return success_response("Platforms fetched successfully.", result)

    return error_response(result)