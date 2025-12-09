"""Initialize database with schema"""
import psycopg2
from config import get_settings

def init_database():
    """Initialize database with schema from schema.sql"""
    settings = get_settings()
    
    # Read schema file
    with open('database/schema.sql', 'r') as f:
        schema_sql = f.read()
    
    # Connect and execute schema
    conn = psycopg2.connect(settings.DATABASE_URL)
    try:
        cursor = conn.cursor()
        cursor.execute(schema_sql)
        conn.commit()
        print("✓ Database initialized successfully!")
        print("✓ Tables created: users, herders, biometrics, livestock, routes, verifications")
        print("✓ Default officer account created: officer@connexxion.gov")
    except Exception as e:
        conn.rollback()
        print(f"✗ Error initializing database: {e}")
        raise
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    init_database()
