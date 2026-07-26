from flask import Blueprint, request

from services.contest_service import (
    add_contest,
    get_all_contests,
    get_contest_by_id,
    update_contest
)
from utils.response import success_response, error_response

contest_bp = Blueprint("contest", __name__)


@contest_bp.route("/contests", methods=["POST"])
def create_contest():

    data = request.get_json()

    required_fields = [
        "user_id",
        "contest_name",
        "platform_id",
        "rank",
        "score",
        "contest_date"
    ]

    if not data:
        return error_response("No JSON data received.")

    for field in required_fields:
        if field not in data:
            return error_response(f"{field} is required.")

    success, message = add_contest(

    data["user_id"],
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
def fetch_contests(user_id):

    success, result = get_all_contests(user_id)

    if success:
        return success_response(
            "Contests fetched successfully.",
            result
        )

    return error_response(result)

@contest_bp.route("/contest/<int:contest_id>", methods=["GET"])
def fetch_contest(contest_id):

    success, result = get_contest_by_id(contest_id)

    if success:
        return success_response(
            "Contest fetched successfully.",
            result
        )

    return error_response(result, 404)

@contest_bp.route("/contest/<int:contest_id>", methods=["PUT"])
def edit_contest(contest_id):

    data = request.get_json()

    if not data:
        return error_response("No JSON data received.")

    required_fields = [
        "platform_id",
        "contest_name",
        "rank",
        "score",
        "contest_date"
    ]

    for field in required_fields:
        if field not in data:
            return error_response(f"{field} is required.")

    success, message = update_contest(
        contest_id,
        data["platform_id"],
        data["contest_name"],
        data["rank"],
        data["score"],
        data["contest_date"]
    )

    if success:
        return success_response(message)

    return error_response(message, 404)