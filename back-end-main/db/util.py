import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from .setup import *
import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ✅ Use connection pooling to prevent memory leaks
connection_pool = None

def get_connection_pool():
    global connection_pool
    if connection_pool is None:
        try:
            connection_pool = pooling.MySQLConnectionPool(
                pool_name="yapin_pool",
                pool_size=5,  # Limit pool size
                pool_reset_session=True,
                host=os.getenv('DB_HOST', 'localhost'),
                user=os.getenv('DB_USERNAME', 'root'),
                password=os.getenv('DB_PASSWORD', ''),
                database=os.getenv('DB_NAME', 'yapin_db'),
                charset='utf8mb4',
                collation='utf8mb4_unicode_ci',
                autocommit=True
            )
            print("✅ Database connection pool created")
        except Exception as e:
            print(f"❌ Error creating connection pool: {e}")
            raise
    return connection_pool

def get_db_connection():
    try:
        pool = get_connection_pool()
        connection = pool.get_connection()
        return connection
    except Exception as e:
        print(f"❌ Error getting database connection: {e}")
        raise

def close_connection(connection):
    try:
        if connection and connection.is_connected():
            connection.close()
    except Exception as e:
        print(f"⚠️ Error closing connection: {e}")

# ✅ Enhanced getAllProduct with memory management
def getAllProduct():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT * FROM product LIMIT 1000"  # Limit results to prevent memory overflow
        cursor.execute(query)
        
        results = cursor.fetchall()
        
        # Convert to list to ensure JSON serialization
        products = []
        for row in results:
            products.append({
                'id': row['id'],
                'name': row['name'],
                'currentPrice': float(row['currentPrice']) if row['currentPrice'] else 0,
                'originalPrice': float(row['originalPrice']) if row['originalPrice'] else 0,
                'imgUrl': row['imgUrl'] or '',
                'stock': int(row['stock']) if row['stock'] else 0,
                'categoryId': int(row['categoryId']) if row['categoryId'] else 0,
                'discount': float(row['discount']) if row['discount'] else 0
            })
        
        print(f"✅ Retrieved {len(products)} products from database")
        return products
        
    except Exception as e:
        print(f"❌ Error in getAllProduct: {e}")
        return []
    finally:
        if cursor:
            cursor.close()
        close_connection(connection)

# ✅ Add similar fixes for other functions
def getAllCategory():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT * FROM category"
        cursor.execute(query)
        
        results = cursor.fetchall()
        categories = []
        for row in results:
            categories.append({
                'id': row['id'],
                'name': row['name'],
                'description': row.get('description', '')
            })
        
        return categories
        
    except Exception as e:
        print(f"❌ Error in getAllCategory: {e}")
        return []
    finally:
        if cursor:
            cursor.close()
        close_connection(connection)

def getAllReview():
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT * FROM review LIMIT 5000"  # Limit to prevent memory issues
        cursor.execute(query)
        
        results = cursor.fetchall()
        reviews = []
        for row in results:
            reviews.append({
                'id': row['id'],
                'review': row['review'] or '',
                'rating': int(row['rating']) if row['rating'] else 0,
                'tanggal': str(row['tanggal']) if row['tanggal'] else '',
                'productId': int(row['productId']) if row['productId'] else 0
            })
        
        return reviews
        
    except Exception as e:
        print(f"❌ Error in getAllReview: {e}")
        return []
    finally:
        if cursor:
            cursor.close()
        close_connection(connection)

def getReviewsByProduct(productId):
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT * FROM review WHERE productId = %s LIMIT 1000"
        cursor.execute(query, (productId,))
        
        results = cursor.fetchall()
        reviews = []
        for row in results:
            reviews.append({
                'id': row['id'],
                'review': row['review'] or '',
                'rating': int(row['rating']) if row['rating'] else 0,
                'tanggal': str(row['tanggal']) if row['tanggal'] else '',
                'productId': int(row['productId']) if row['productId'] else 0
            })
        
        return reviews
        
    except Exception as e:
        print(f"❌ Error in getReviewsByProduct: {e}")
        return []
    finally:
        if cursor:
            cursor.close()
        close_connection(connection)

def getReviewsByCategory(categoryId):
  try:
    dbCursor.execute(f'SELECT rv.* FROM category ct JOIN product pr ON ct.id = pr.categoryId JOIN review rv ON rv.productId = pr.id WHERE ct.id = {categoryId}')
    result = dbCursor.fetchall()
    column_names = dbCursor.column_names
    result = [dict(zip(column_names, row)) for row in result]
    return result
  except Exception as e:
    print('Error fetching the data', e)
    return None
  

def getSentimentByProduct(productId):
  try:
    dbCursor.execute(f'SELECT productId, sentiment_positive, sentiment_negative, sentiment_neutral FROM prediction WHERE productId = {productId}')
    result = dbCursor.fetchall()
    column_names = dbCursor.column_names
    result = [dict(zip(column_names, row)) for row in result]
    return result
  except Exception as e:
    print('Error fetching the data', e)
    return None

def getAllProductsByName(name):
  try:
    dbCursor.execute(f'SELECT * FROM product WHERE LOWER(name) LIKE \'%{name}%\'')
    result = dbCursor.fetchall()
    column_names = dbCursor.column_names
    result = [dict(zip(column_names, row)) for row in result]
    return result
  except Exception as e:
    print('Error fetching the data', e)
    return None
