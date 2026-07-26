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

def get_all_activities(user_id):

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        cursor.execute(
            """
            SELECT
                activity_id,
                practice_date,
                coding_minutes,
                problems_solved
            FROM daily_activity
            WHERE user_id = %s
            ORDER BY practice_date DESC;
            """,
            (user_id,)
        )

        activities = cursor.fetchall()

        return True, activities

    except Exception as error:

        return False, str(error)

    finally:

        cursor.close()
        connection.close()

def get_activity_by_id(activity_id):

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        cursor.execute(
            """
            SELECT
                activity_id,
                user_id,
                practice_date,
                coding_minutes,
                problems_solved
            FROM daily_activity
            WHERE activity_id = %s;
            """,
            (activity_id,)
        )

        activity = cursor.fetchone()

        if activity is None:
            return False, "Activity not found."

        return True, activity

    except Exception as error:

        return False, str(error)

    finally:

        cursor.close()
        connection.close()

def update_activity(
    activity_id,
    practice_date,
    coding_minutes,
    problems_solved
):

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        cursor.execute(
            """
            UPDATE daily_activity
            SET
                practice_date = %s,
                coding_minutes = %s,
                problems_solved = %s
            WHERE activity_id = %s;
            """,
            (
                practice_date,
                coding_minutes,
                problems_solved,
                activity_id
            )
        )

        if cursor.rowcount == 0:
            return False, "Activity not found."

        connection.commit()

        return True, "Activity updated successfully."

    except Exception as error:

        connection.rollback()
        return False, str(error)

    finally:

        cursor.close()
        connection.close()

def delete_activity(activity_id):

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        cursor.execute(
            """
            DELETE FROM daily_activity
            WHERE activity_id = %s;
            """,
            (activity_id,)
        )

        if cursor.rowcount == 0:
            return False, "Activity not found."

        connection.commit()

        return True, "Activity deleted successfully."

    except Exception as error:

        connection.rollback()
        return False, str(error)

    finally:

        cursor.close()
        connection.close()