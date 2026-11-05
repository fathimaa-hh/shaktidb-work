from flask import Blueprint, session
from flask import request, session

from services.dashboard_service import (
    get_dashboard,
    problems_by_platform,
    problems_by_difficulty,
    problems_by_topic,
    monthly_activity,
    contest_performance,
    daily_activity_analytics
)

from utils.response import success_response, error_response
from utils.auth import login_required

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard/<int:user_id>", methods=["GET"])
@login_required
def dashboard(user_id):
    if user_id != session["user_id"]:
        return error_response("Access denied.", 403)

    success, result = get_dashboard(session["user_id"])

    if success:
        return success_response("Dashboard loaded successfully.", result)

    return error_response(result)


@dashboard_bp.route("/dashboard/platforms/<int:user_id>", methods=["GET"])
@login_required
def dashboard_platform(user_id):
    if user_id != session["user_id"]:
        return error_response("Access denied.", 403)

    success, result = problems_by_platform(session["user_id"])

    if success:
        return success_response("Platform statistics fetched successfully.", result)

    return error_response(result)


@dashboard_bp.route("/dashboard/difficulty/<int:user_id>", methods=["GET"])
@login_required
def dashboard_difficulty(user_id):
    if user_id != session["user_id"]:
        return error_response("Access denied.", 403)

    success, result = problems_by_difficulty(session["user_id"])

    if success:
        return success_response("Difficulty statistics fetched successfully.", result)

    return error_response(result)


@dashboard_bp.route("/dashboard/topics/<int:user_id>", methods=["GET"])
@login_required
def dashboard_topics(user_id):
    if user_id != session["user_id"]:
        return error_response("Access denied.", 403)

    success, result = problems_by_topic(session["user_id"])

    if success:
        return success_response("Topic statistics fetched successfully.", result)

    return error_response(result)


@dashboard_bp.route("/dashboard/monthly/<int:user_id>", methods=["GET"])
@login_required
def dashboard_monthly(user_id):
    if user_id != session["user_id"]:
        return error_response("Access denied.", 403)

    success, result = monthly_activity(session["user_id"])

    if success:
        return success_response("Monthly statistics fetched successfully.", result)

    return error_response(result)


@dashboard_bp.route("/dashboard/contests/<int:user_id>", methods=["GET"])
@login_required
def dashboard_contests(user_id):
    if user_id != session["user_id"]:
        return error_response("Access denied.", 403)

    success, result = contest_performance(session["user_id"])

    if success:
        return success_response("Contest analytics fetched successfully.", result)

    return error_response(result)


@dashboard_bp.route("/dashboard/activity/<int:user_id>", methods=["GET"])
@login_required
def dashboard_activity(user_id):

    if user_id != session["user_id"]:
        return error_response("Access denied.", 403)

    # Get optional date range
    days = request.args.get("days", default=None, type=int)

    # Validate date range
    if days is not None and days not in (7, 30):
        return error_response("Invalid date range.", 400)

    # Fetch activity using authenticated user ID
    success, result = daily_activity_analytics(
        session["user_id"],
        days
    )

    if success:
        return success_response(
            "Activity analytics fetched successfully.",
            result
        )

    return error_response(result)
