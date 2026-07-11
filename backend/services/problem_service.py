from database.connection import get_connection
from psycopg2.extras import RealDictCursor


def add_problem(
    user_id,
    problem_id,
    attempts,
    time_taken,
    language,
    notes
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
            INSERT INTO user_problem_history
            (
                user_id,
                problem_id,
                status,
                attempts,
                time_taken,
                language,
                notes,
                solved_date
            )
            VALUES
            (%s,%s,'Solved',%s,%s,%s,%s,CURRENT_DATE);
            """,
            (
                user_id,
                problem_id,
                attempts,
                time_taken,
                language,
                notes
            )
        )

        connection.commit()

        return True, "Problem added successfully."

    except Exception as error:

        connection.rollback()

        return False, str(error)

    finally:

        cursor.close()
        connection.close()

def get_all_problems(user_id):

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
                h.history_id,
                p.title,
                pf.platform_name,
                t.topic_name,
                p.difficulty,
                h.attempts,
                h.time_taken,
                h.language,
                h.solved_date
            FROM user_problem_history h
            JOIN problems p
                ON h.problem_id = p.problem_id
            JOIN platforms pf
                ON p.platform_id = pf.platform_id
            JOIN topics t
                ON p.topic_id = t.topic_id
            WHERE h.user_id = %s
            ORDER BY h.solved_date DESC;
            """,
            (user_id,)
        )

        problems = cursor.fetchall()

        return True, problems

    except Exception as error:

        return False, str(error)

    finally:

        cursor.close()
        connection.close()