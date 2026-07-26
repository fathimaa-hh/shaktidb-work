from database.connection import get_connection
from psycopg2.extras import RealDictCursor


def add_activity(
    user_id,
    practice_date,
    coding_minutes,
    problems_solved
):

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:

        cursor.execute(
            """
            INSERT INTO daily_activity
            (
                user_id,
                practice_date,
                coding_minutes,
                problems_solved
            )
            VALUES (%s, %s, %s, %s);
            """,
            (
                user_id,
                practice_date,
                coding_minutes,
                problems_solved
            )
        )

        connection.commit()

        return True, "Activity added successfully."

    except Exception as error:

        connection.rollback()
        return False, str(error)

    finally:

        cursor.close()
        connection.close()