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

def get_problem_by_id(history_id):

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
                h.notes,
                h.solved_date
            FROM user_problem_history h
            JOIN problems p
                ON h.problem_id = p.problem_id
            JOIN platforms pf
                ON p.platform_id = pf.platform_id
            JOIN topics t
                ON p.topic_id = t.topic_id
            WHERE h.history_id = %s;
            """,
            (history_id,)
        )

        problem = cursor.fetchone()

        if problem is None:
            return False, "Problem not found."

        return True, problem

    except Exception as error:

        return False, str(error)

    finally:

        cursor.close()
        connection.close()

def update_problem(history_id, attempts, time_taken, language, notes):

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        cursor.execute(
            """
            UPDATE user_problem_history
            SET
                attempts = %s,
                time_taken = %s,
                language = %s,
                notes = %s
            WHERE history_id = %s;
            """,
            (
                attempts,
                time_taken,
                language,
                notes,
                history_id
            )
        )

        if cursor.rowcount == 0:
            return False, "Problem not found."

        connection.commit()

        return True, "Problem updated successfully."

    except Exception as error:

        connection.rollback()

        return False, str(error)

    finally:

        cursor.close()
        connection.close()

def delete_problem(history_id):

    connection = get_connection()

    if connection is None:
        return False, "Database connection failed."

    cursor = connection.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        cursor.execute(
            """
            DELETE FROM user_problem_history
            WHERE history_id = %s;
            """,
            (history_id,)
        )

        if cursor.rowcount == 0:
            return False, "Problem not found."

        connection.commit()

        return True, "Problem deleted successfully."

    except Exception as error:

        connection.rollback()
        return False, str(error)

    finally:

        cursor.close()
        connection.close()