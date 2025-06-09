import os
from dotenv import load_dotenv
from db.util import get_connection, getAllProduct, getAllCategory

load_dotenv()

def test_database():
    print("🔍 Testing database connection...")
    
    try:
        # Test connection
        conn = get_connection()
        print("✅ Database connection successful")
        conn.close()
        
        # Test data fetch
        products = getAllProduct()
        categories = getAllCategory()
        
        print(f"✅ Products found: {len(products) if products else 0}")
        print(f"✅ Categories found: {len(categories) if categories else 0}")
        
        if products and len(products) > 0:
            print(f"✅ Sample product: {products[0]['name']}")
            
    except Exception as e:
        print(f"❌ Database test failed: {e}")

if __name__ == "__main__":
    test_database()