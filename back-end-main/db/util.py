import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# ❌ HAPUS BARIS INI: from .setup import *
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
        
        query = "SELECT * FROM category LIMIT 100"
        cursor.execute(query)
        
        results = cursor.fetchall()
        categories = []
        for row in results:
            categories.append({
                'id': row['id'],
                'name': row['name']
            })
        
        print(f"✅ Retrieved {len(categories)} categories from database")
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
        
        query = "SELECT * FROM review LIMIT 5000"
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
        
        print(f"✅ Retrieved {len(reviews)} reviews from database")
        return reviews
        
    except Exception as e:
        print(f"❌ Error in getAllReview: {e}")
        return []
    finally:
        if cursor:
            cursor.close()
        close_connection(connection)

def getProductsByCategory(categoryId):
    """Get products by category ID"""
    connection = None
    cursor = None
    try:
        print(f"🔍 DB: Getting products for category {categoryId}")
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT * FROM product WHERE categoryId = %s LIMIT 1000"
        cursor.execute(query, (categoryId,))
        
        results = cursor.fetchall()
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
        
        print(f"✅ DB: Retrieved {len(products)} products for category {categoryId}")
        return products
        
    except Exception as e:
        print(f"❌ DB Error in getProductsByCategory: {e}")
        import traceback
        traceback.print_exc()
        return []
    finally:
        if cursor:
            cursor.close()
        close_connection(connection)

def getReviewsByProduct(productId):
    """Get reviews by product ID"""
    connection = None
    cursor = None
    try:
        print(f"🔍 DB: Getting reviews for product {productId}")
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
        
        print(f"✅ DB: Retrieved {len(reviews)} reviews for product {productId}")
        return reviews
        
    except Exception as e:
        print(f"❌ DB Error in getReviewsByProduct: {e}")
        import traceback
        traceback.print_exc()
        return []
    finally:
        if cursor:
            cursor.close()
        close_connection(connection)

def getReviewsByCategory(categoryId):
    """Get reviews by category ID"""
    connection = None
    cursor = None
    try:
        print(f"🔍 DB: Getting reviews for category {categoryId}")
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = """
        SELECT rv.* FROM category ct 
        JOIN product pr ON ct.id = pr.categoryId 
        JOIN review rv ON rv.productId = pr.id 
        WHERE ct.id = %s LIMIT 1000
        """
        cursor.execute(query, (categoryId,))
        
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
        
        print(f"✅ DB: Retrieved {len(reviews)} reviews for category {categoryId}")
        return reviews
        
    except Exception as e:
        print(f"❌ DB Error in getReviewsByCategory: {e}")
        import traceback
        traceback.print_exc()
        return []
    finally:
        if cursor:
            cursor.close()
        close_connection(connection)

def getSentimentByProduct(productId):
    """Get sentiment analysis by product ID"""
    connection = None
    cursor = None
    try:
        print(f"🔍 DB: Getting sentiment for product {productId}")
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT productId, sentiment_positive, sentiment_negative, sentiment_neutral FROM prediction WHERE productId = %s"
        cursor.execute(query, (productId,))
        
        results = cursor.fetchall()
        sentiments = []
        for row in results:
            sentiments.append({
                'productId': int(row['productId']) if row['productId'] else 0,
                'sentiment_positive': float(row['sentiment_positive']) if row['sentiment_positive'] else 0,
                'sentiment_negative': float(row['sentiment_negative']) if row['sentiment_negative'] else 0,
                'sentiment_neutral': float(row['sentiment_neutral']) if row['sentiment_neutral'] else 0
            })
        
        print(f"✅ DB: Retrieved {len(sentiments)} sentiment records for product {productId}")
        return sentiments
        
    except Exception as e:
        print(f"❌ DB Error in getSentimentByProduct: {e}")
        import traceback
        traceback.print_exc()
        return []
    finally:
        if cursor:
            cursor.close()
        close_connection(connection)

def getAllProductsByName(name):
    """Search products by name"""
    connection = None
    cursor = None
    try:
        print(f"🔍 DB: Searching products by name: {name}")
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT * FROM product WHERE LOWER(name) LIKE %s LIMIT 500"
        search_term = f'%{name.lower()}%'
        cursor.execute(query, (search_term,))
        
        results = cursor.fetchall()
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
        
        print(f"✅ DB: Found {len(products)} products with name '{name}'")
        return products
        
    except Exception as e:
        print(f"❌ DB Error in getAllProductsByName: {e}")
        import traceback
        traceback.print_exc()
        return []
    finally:
        if cursor:
            cursor.close()
        close_connection(connection)

def getProductById(productId):
    """Get single product by ID"""
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        query = "SELECT * FROM product WHERE id = %s"
        cursor.execute(query, (productId,))
        
        result = cursor.fetchone()
        if result:
            return {
                'id': result['id'],
                'name': result['name'],
                'currentPrice': float(result['currentPrice']) if result['currentPrice'] else 0,
                'originalPrice': float(result['originalPrice']) if result['originalPrice'] else 0,
                'imgUrl': result['imgUrl'] or '',
                'stock': int(result['stock']) if result['stock'] else 0,
                'categoryId': int(result['categoryId']) if result['categoryId'] else 0,
                'discount': float(result['discount']) if result['discount'] else 0
            }
        return None
        
    except Exception as e:
        print(f"❌ Error in getProductById: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        close_connection(connection)
