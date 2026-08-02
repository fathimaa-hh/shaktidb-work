from database.connection import get_connection
from psycopg2.extras import RealDictCursor


def add_achievement(
    user_id,
    achievement_name,
    description
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
            INSERT INTO achievements
            (
                user_id,
                achievement_name,
                description
            )
            VALUES (%s,%s,%s);
            """,
            (
                user_id,
                achievement_name,
                description
            )
        )

        connection.commit()

        return True, "Achievement added successfully."

    except Exception as error:

        connection.rollback()

        return False, str(error)

    finally:

        cursor.close()
        connection.close()


def get_achievements(user_id):

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
                achievement_id,
                achievement_name,
                description,
                achieved_date
            FROM achievements
            WHERE user_id=%s
            ORDER BY achieved_date DESC;
            """,
            (user_id,)
        )

        return True, cursor.fetchall()

    except Exception as error:

        return False, str(error)

    finally:

        cursor.close()
        connection.close()

def delete_achievement(achievement_id):

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        cursor.execute(
            """
            DELETE FROM achievements
            WHERE achievement_id=%s;
            """,
            (achievement_id,)
        )

        if cursor.rowcount == 0:
            return False, "Achievement not found."

        connection.commit()

        return True, "Achievement deleted successfully."

    except Exception as error:

        connection.rollback()

        return False, str(error)

    finally:

        cursor.close()
        connection.close()


