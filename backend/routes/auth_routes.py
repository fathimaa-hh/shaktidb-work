from flask import Blueprint, request, jsonify
from services.auth_service import register_user

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No JSON data received."
        }), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "error": "All fields are required."
        }), 400

    success, message = register_user(
        name,
        email,
        password
    )

    if success:

        return jsonify({
            "message": message
        }), 201

    return jsonify({
        "error": message
    }), 400