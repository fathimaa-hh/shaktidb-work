import psycopg2
from psycopg2 import OperationalError
from config import Config


def get_connection():
    """
    Create and return a database connection.
    """

    try:
        connection = psycopg2.connect(
            host=Config.DB_HOST,
            port=Config.DB_PORT,
            database=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD
        )

        print("✅ Connected to ShaktiDB successfully!")

        return connection

    except OperationalError as error:
        print("❌ Database Connection Failed")
        print(error)

        return None
        