from database.connection import get_connection
from psycopg2.extras import RealDictCursor

def get_dashboard(user_id):

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

                (
                    SELECT COUNT(*)
                    FROM user_problem_history
                    WHERE user_id=%s
                ) AS total_problems,

                (
                    SELECT COUNT(*)
                    FROM contests
                    WHERE user_id=%s
                ) AS total_contests,

                (
                    SELECT COUNT(*)
                    FROM daily_activity
                    WHERE user_id=%s
                ) AS total_practice_days,

                (
                    SELECT COALESCE(SUM(coding_minutes),0)
                    FROM daily_activity
                    WHERE user_id=%s
                ) AS total_coding_minutes;
            """,

            (
                user_id,
                user_id,
                user_id,
                user_id
            )

        )

        dashboard = cursor.fetchone()

        return True, dashboard

    except Exception as error:

        return False, str(error)

    finally:

        cursor.close()
        connection.close()

def problems_by_platform(user_id):

    connection=get_connection()

    if connection is None:
        return False,"Database connection failed."

    cursor=connection.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        cursor.execute(
    """
    SELECT
        p.platform_name,
        COUNT(*) AS solved
    FROM user_problem_history uph

    JOIN problems pr
        ON uph.problem_id = pr.problem_id

    JOIN platforms p
        ON pr.platform_id = p.platform_id

    WHERE uph.user_id = %s

    GROUP BY p.platform_name

    ORDER BY solved DESC;
    """,
    (user_id,)
)

        return True,cursor.fetchall()

    except Exception as error:

        return False,str(error)

    finally:

        cursor.close()
        connection.close()


def problems_by_difficulty(user_id):

    connection=get_connection()

    if connection is None:
        return False,"Database connection failed."

    cursor=connection.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        cursor.execute(
    """
    SELECT
        pr.difficulty,
        COUNT(*) AS solved

    FROM user_problem_history uph

    JOIN problems pr
        ON uph.problem_id = pr.problem_id

    WHERE uph.user_id = %s

    GROUP BY pr.difficulty

    ORDER BY solved DESC;
    """,
    (user_id,)
)

        return True,cursor.fetchall()

    except Exception as error:

        return False,str(error)

    finally:

        cursor.close()
        connection.close()


def problems_by_topic(user_id):

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

                t.topic_name,

                COUNT(*) AS solved

            FROM user_problem_history uph

            JOIN problems pr
                ON uph.problem_id = pr.problem_id

            JOIN topics t
                ON pr.topic_id = t.topic_id

            WHERE uph.user_id = %s

            GROUP BY t.topic_name

            ORDER BY solved DESC;
            """,
            (user_id,)
        )

        topics = cursor.fetchall()

        return True, topics

    except Exception as error:

        return False, str(error)

    finally:

        cursor.close()
        connection.close()


def monthly_activity(user_id):

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

                TO_CHAR(practice_date, 'YYYY-MM') AS month,

                SUM(coding_minutes) AS total_minutes,

                SUM(problems_solved) AS total_problems

            FROM daily_activity

            WHERE user_id = %s

            GROUP BY TO_CHAR(practice_date, 'YYYY-MM')

            ORDER BY month;
            """,
            (user_id,)
        )

        monthly = cursor.fetchall()

        return True, monthly

    except Exception as error:

        return False, str(error)

    finally:

        cursor.close()
        connection.close()