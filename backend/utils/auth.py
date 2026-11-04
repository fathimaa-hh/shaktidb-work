from functools import wraps
from flask import session
from utils.response import error_response


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return error_response("Please log in first.", 401)

        return func(*args, **kwargs)

    return wrapper