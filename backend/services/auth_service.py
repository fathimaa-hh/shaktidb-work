from database.connection import get_connection
import bcrypt
from psycopg2.extras import RealDictCursor


def register_user(name, email, password):
    """
    Register a new user.
    """

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(
        cursor_factory=RealDictCursor
    )

    try:
        # Check if email already exists
        cursor.execute(
            "SELECT user_id FROM users WHERE email = %s;",
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return False, "Email already registered."

        # Hash password
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # Insert user
        cursor.execute(
            """
            INSERT INTO users (name, email, password)
            VALUES (%s, %s, %s);
            """,
            (name, email, hashed_password)
        )

        connection.commit()

        return True, "Registration successful."

    except Exception as error:
        connection.rollback()
        return False, str(error)

    finally:
        cursor.close()
        connection.close()


def login_user(email, password):
    """
    Authenticate a user.
    """

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(
        cursor_factory=RealDictCursor
    )

    try:
        cursor.execute(
            """
            SELECT user_id, name, email, password
            FROM users
            WHERE email = %s;
            """,
            (email,)
        )

        user = cursor.fetchone()

        if user is None:
            return False, "Invalid email or password."

        stored_password = user["password"]

        if bcrypt.checkpw(
            password.encode("utf-8"),
            stored_password.encode("utf-8")
        ):
            return True, {
                "user_id": user["user_id"],
                "name": user["name"],
                "email": user["email"]
            }

        return False, "Invalid email or password."

    except Exception as error:
        return False, str(error)

    finally:
        cursor.close()
        connection.close()