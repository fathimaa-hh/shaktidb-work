from database.connection import get_connection
from psycopg2.extras import RealDictCursor


def add_contest(
    user_id,
    platform_id,
    contest_name,
    rank,
    score,
    contest_date
):

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:

        cursor.execute(
        """
        INSERT INTO contests
        (
            user_id,
            platform_id,
            contest_name,
            rank,
            score,
            contest_date
        )
        VALUES (%s, %s, %s, %s, %s, %s);
        """,
        (
            user_id,
            platform_id,
            contest_name,
            rank,
            score,
            contest_date
        )
    )

        connection.commit()

        return True, "Contest added successfully."

    except Exception as error:

        connection.rollback()

        return False, str(error)

    finally:

        cursor.close()
        connection.close()

def get_all_contests(user_id):

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
            ORDER BY c.contest_date DESC;
            """,
            (user_id,)
        )

        contests = cursor.fetchall()

        return True, contests

    except Exception as error:

        return False, str(error)

    finally:

        cursor.close()
        connection.close()

def get_contest_by_id(contest_id):

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
                c.contest_id,
                c.contest_name,
                p.platform_name,
                c.rank,
                c.score,
                c.contest_date
            FROM contests c
            JOIN platforms p
            ON c.platform_id = p.platform_id
            WHERE c.contest_id = %s;
            """,
            (contest_id,)
        )

        contest = cursor.fetchone()

        if contest is None:
            return False, "Contest not found."

        return True, contest

    except Exception as error:

        return False, str(error)

    finally:

        cursor.close()
        connection.close()