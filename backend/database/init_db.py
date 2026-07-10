from database.connection import get_connection


def test_connection():
    connection = get_connection()

    if connection:
        print("Database connection successful!")

        connection.close()

        print("Connection closed.")


if __name__ == "__main__":
    test_connection()
