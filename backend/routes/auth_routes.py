from flask import Blueprint, request
from services.auth_service import register_user, login_user
from utils.response import success_response, error_response
auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:
        return error_response("No JSON data received.")

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return error_response("All fields are required.")

    success, message = register_user(
    name,
    email,
    password
    )

    if success:
        return success_response(
        message,
        status_code=201
    )

    return error_response(message)
    from utils.response import success_response, error_response

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return error_response("No JSON data received.")

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return error_response("Email and password are required.")

    success, result = login_user(email, password)

    if success:
        return success_response(
            "Login successful.",
            result
        )

    return error_response(result)