from .setup import *
# ✅ Tambahkan connection pooling dan error handling yang lebih baik
import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

# Create connection pool
config = {
    'user': os.getenv('DB_USERNAME'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'database': os.getenv('DB_NAME'),
    'pool_name': 'mypool',
    'pool_size': 5,
    'pool_reset_session': True,
    'autocommit': True
}

try:
    pool = pooling.MySQLConnectionPool(**config)
    print("✅ Database connection pool created successfully")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    pool = None

def get_connection():
    if pool:
        return pool.get_connection()
    else:
        raise Exception("Database connection pool not available")

# ✅ Update semua fungsi untuk menggunakan connection pool
def getAllProduct():
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM product')
        result = cursor.fetchall()
        column_names = cursor.column_names
        result = [dict(zip(column_names, row)) for row in result]
        return result
    except Exception as e:
        print('Error fetching products:', e)
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def getAllCategory():
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM category')
        result = cursor.fetchall()
        column_names = cursor.column_names
        result = [dict(zip(column_names, row)) for row in result]
        return result
    except Exception as e:
        print('Error fetching categories:', e)
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def getAllReview():
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM review')
        result = cursor.fetchall()
        column_names = cursor.column_names
        result = [dict(zip(column_names, row)) for row in result]
        return result
    except Exception as e:
        print('Error fetching reviews:', e)
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def getProductsByCategory(categoryId):
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM product WHERE categoryId = %s', (categoryId,))
        result = cursor.fetchall()
        column_names = cursor.column_names
        result = [dict(zip(column_names, row)) for row in result]
        return result
    except Exception as e:
        print('Error fetching products by category:', e)
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def getReviewsByProduct(productId):
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM review WHERE productId = %s', (productId,))
        result = cursor.fetchall()
        column_names = cursor.column_names
        result = [dict(zip(column_names, row)) for row in result]
        return result
    except Exception as e:
        print('Error fetching reviews by product:', e)
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def getReviewsByCategory(categoryId):
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('''
            SELECT rv.* FROM category ct 
            JOIN product pr ON ct.id = pr.categoryId 
            JOIN review rv ON rv.productId = pr.id 
            WHERE ct.id = %s
        ''', (categoryId,))
        result = cursor.fetchall()
        column_names = cursor.column_names
        result = [dict(zip(column_names, row)) for row in result]
        return result
    except Exception as e:
        print('Error fetching reviews by category:', e)
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def getSentimentByProduct(productId):
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('''
            SELECT productId, sentiment_positive, sentiment_negative, sentiment_neutral 
            FROM prediction WHERE productId = %s
        ''', (productId,))
        result = cursor.fetchall()
        column_names = cursor.column_names
        result = [dict(zip(column_names, row)) for row in result]
        return result
    except Exception as e:
        print('Error fetching sentiment by product:', e)
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def getAllProductsByName(name):
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute('SELECT * FROM product WHERE LOWER(name) LIKE %s', (f'%{name.lower()}%',))
        result = cursor.fetchall()
        column_names = cursor.column_names
        result = [dict(zip(column_names, row)) for row in result]
        return result
    except Exception as e:
        print('Error fetching products by name:', e)
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()