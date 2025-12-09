"""Database connection and utilities"""
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from config import get_settings

settings = get_settings()

@contextmanager
def get_db_connection():
    """Get database connection context manager"""
    conn = psycopg2.connect(settings.DATABASE_URL, cursor_factory=RealDictCursor)
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def execute_query(query: str, params: tuple = None, fetch: bool = True):
    """Execute a database query"""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params)
            if fetch:
                return cursor.fetchall()
            return cursor.rowcount

def execute_one(query: str, params: tuple = None):
    """Execute query and return single result"""
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchone()
