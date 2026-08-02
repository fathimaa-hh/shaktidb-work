from flask import Blueprint

from services.dashboard_service import (
    get_dashboard,
    problems_by_platform,
    problems_by_difficulty,
    problems_by_topic,
    monthly_activity
)

from utils.response import (
    success_response,
    error_response
)

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard/<int:user_id>",methods=["GET"])
def dashboard(user_id):

    success,result = get_dashboard(user_id)

    if success:

        return success_response(
            "Dashboard loaded successfully.",
            result
        )

    return error_response(result)

@dashboard_bp.route("/dashboard/platforms/<int:user_id>",methods=["GET"])
def dashboard_platform(user_id):

    success,result=problems_by_platform(user_id)

    if success:

        return success_response(
            "Platform statistics fetched successfully.",
            result
        )

    return error_response(result)

@dashboard_bp.route("/dashboard/difficulty/<int:user_id>",methods=["GET"])
def dashboard_difficulty(user_id):

    success,result=problems_by_difficulty(user_id)

    if success:

        return success_response(
            "Difficulty statistics fetched successfully.",
            result
        )

    return error_response(result)


@dashboard_bp.route("/dashboard/topics/<int:user_id>", methods=["GET"])
def dashboard_topics(user_id):

    success, result = problems_by_topic(user_id)

    if success:
        return success_response(
            "Topic statistics fetched successfully.",
            result
        )

    return error_response(result)



@dashboard_bp.route("/dashboard/monthly/<int:user_id>", methods=["GET"])
def dashboard_monthly(user_id):

    success, result = monthly_activity(user_id)

    if success:
        return success_response(
            "Monthly statistics fetched successfully.",
            result
        )

    return error_response(result)