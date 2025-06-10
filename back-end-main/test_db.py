import os
from dotenv import load_dotenv
from db.util import *

load_dotenv()

def test_database():
    print("🔍 Testing database connection...")
    
    try:
        # Test connection - gunakan fungsi yang benar
        conn = get_db_connection()
        print("✅ Database connection successful")
        close_connection(conn)
        
        # Test data fetch
        products = getAllProduct()
        categories = getAllCategory()
        
        print(f"✅ Products found: {len(products) if products else 0}")
        print(f"✅ Categories found: {len(categories) if categories else 0}")
        
        if products and len(products) > 0:
            print(f"✅ Sample product: {products[0]['name']}")
            
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        import traceback
        traceback.print_exc()

def test_database_functions():
    print("🧪 Testing database functions...")
    
    # Test 1: Get all products
    print("\n1️⃣ Testing getAllProduct()...")
    try:
        products = getAllProduct()
        print(f"✅ Found {len(products)} products")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Get all categories
    print("\n2️⃣ Testing getAllCategory()...")
    try:
        categories = getAllCategory()
        print(f"✅ Found {len(categories)} categories")
    except Exception as e:
        print(f"❌ Error: {e}")
        categories = []
    
    # Test 3: Get products by category
    if categories:
        first_category_id = categories[0]['id']
        print(f"\n3️⃣ Testing getProductsByCategory({first_category_id})...")
        try:
            category_products = getProductsByCategory(first_category_id)
            print(f"✅ Found {len(category_products)} products in category {first_category_id}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    # Test 4: Get reviews
    print("\n4️⃣ Testing getAllReview()...")
    try:
        reviews = getAllReview()
        print(f"✅ Found {len(reviews)} reviews")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 5: Search products by name
    print("\n5️⃣ Testing getAllProductsByName('jam')...")
    try:
        search_results = getAllProductsByName('jam')
        print(f"✅ Found {len(search_results)} products with 'jam' in name")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n🎉 All database tests completed!")

if __name__ == "__main__":
    test_database()
    test_database_functions()