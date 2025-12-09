"""Update the default officer password"""
import psycopg2
from config import get_settings

settings = get_settings()
conn = psycopg2.connect(settings.DATABASE_URL)
cursor = conn.cursor()

# Correct hash for "SecurePass123"
correct_hash = '3afeed04eeca02f36260571b19deb0898adfabcf3d0283aacdc9cafb81e0b0e1'

cursor.execute(
    "UPDATE users SET password_hash = %s WHERE email = %s",
    (correct_hash, 'officer@connexxion.gov')
)
conn.commit()
print("✓ Password updated successfully!")
print("✓ You can now login with: officer@connexxion.gov / SecurePass123")

cursor.close()
conn.close()
