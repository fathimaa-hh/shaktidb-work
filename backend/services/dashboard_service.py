from database.connection import get_connection
from psycopg2.extras import RealDictCursor

def get_dashboard(user_id):

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute(
            """
            WITH problem_status AS (

                SELECT
                    problem_id,
                    BOOL_OR(status = 'Solved') AS is_solved,
                    BOOL_OR(status = 'Attempted') AS is_attempted

                FROM user_problem_history

                WHERE user_id = %s

                GROUP BY problem_id
            ),

            problem_summary AS (

                SELECT
                    COUNT(*) FILTER (
                        WHERE is_solved = TRUE
                    ) AS total_problems,

                    COUNT(*) FILTER (
                        WHERE is_attempted = TRUE
                        AND is_solved = FALSE
                    ) AS total_attempted,

                    COUNT(*) AS total_tracked_problems

                FROM problem_status
            )

            SELECT

                ps.total_problems,

                ps.total_attempted,

                ps.total_tracked_problems,

                CASE
                    WHEN ps.total_tracked_problems = 0 THEN 0
                    ELSE ROUND(
                        ps.total_problems * 100.0 /
                        ps.total_tracked_problems,
                        2
                    )::DOUBLE PRECISION
                END AS completion_rate,

                (
                    SELECT COUNT(*)
                    FROM contests
                    WHERE user_id = %s
                ) AS total_contests,

                (
                    SELECT COUNT(DISTINCT practice_date)
                    FROM daily_activity
                    WHERE user_id = %s
                ) AS total_practice_days,

                (
                    SELECT COALESCE(SUM(coding_minutes), 0)
                    FROM daily_activity
                    WHERE user_id = %s
                ) AS total_coding_minutes

            FROM problem_summary ps;
            """,
            (user_id, user_id, user_id, user_id)
        )

        return True, cursor.fetchone()

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
    AND uph.status = 'Solved'
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
    AND uph.status = 'Solved'

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
            AND uph.status = 'Solved'

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

def contest_performance(user_id):
    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute(
            """
            SELECT
                c.contest_id,
                c.contest_name,
                p.platform_name,
                c.rank,
                c.score,
                c.contest_date
            FROM contests c
            JOIN platforms p
                ON c.platform_id = p.platform_id
            WHERE c.user_id = %s
            ORDER BY c.contest_date ASC;
            """,
            (user_id,)
        )

        return True, cursor.fetchall()

    except Exception as error:
        return False, str(error)

    finally:
        cursor.close()
        connection.close()


def daily_activity_analytics(user_id, days=None):

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:

        if days is None:

            cursor.execute(
                """
                SELECT
                    practice_date,
                    SUM(coding_minutes) AS coding_minutes,
                    SUM(problems_solved) AS problems_solved
                FROM daily_activity
                WHERE user_id = %s
                GROUP BY practice_date
                ORDER BY practice_date ASC;
                """,
                (user_id,)
            )

        else:

            cursor.execute(
                """
                SELECT
                    practice_date,
                    SUM(coding_minutes) AS coding_minutes,
                    SUM(problems_solved) AS problems_solved
                FROM daily_activity
                WHERE user_id = %s
                AND practice_date >= CURRENT_DATE - (%s - 1)
                AND practice_date <= CURRENT_DATE
                GROUP BY practice_date
                ORDER BY practice_date ASC;
                """,
                (user_id, days)
            )

        return True, cursor.fetchall()

    except Exception as error:
        return False, str(error)

    finally:
        cursor.close()
        connection.close()