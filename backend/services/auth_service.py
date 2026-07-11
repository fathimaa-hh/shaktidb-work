import bcrypt
from database.connection import get_connection


def register_user(name, email, password):
    """
    Register a new user.
    """

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor()

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